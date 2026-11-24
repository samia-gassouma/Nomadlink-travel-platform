import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaypalService } from 'src/app/front-office/services/paypal/paypal.service'; // ✅ Service PayPal
import { HttpClient } from '@angular/common/http';
import { Reservation, ModePaiement } from 'src/app/front-office/models/reservation.model';
import { Event } from 'src/app/front-office/models/evenement.model';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrentuserService } from 'src/app/services/gestionUser/service_me/currentuser.service';
import {EventService} from "../../services/event.service";


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation-event.component.html',
  styleUrls: ['./reservation-event.component.css']
})
export class ReservationEventComponent implements OnInit {
  reservationForm!: FormGroup;
  userId!: number; // Dynamically set user ID
  eventId!: number;
  message: string = '';
  @Input() updateStep!: (etape: string) => void;
  eventDetails!: Event;
  selectedPayment: ModePaiement = ModePaiement.Virement;
  paymentConfirmed: boolean = false;
  public payPalConfig?: IPayPalConfig; // ✅ Configuration PayPal

  ModePaiement = ModePaiement;

  constructor(
    private fb: FormBuilder,
    private paypalService: PaypalService, // ✅ Utilisation du service PayPal
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService, // ✅ Event Service
    private currentuserService: CurrentuserService // Ajoutez cette ligne


  ) {}

  ngOnInit(): void {
    this.initForm();
    this.retrieveUserId(); // ✅ Fetch user ID dynamically or use default ID
    this.retrieveEventId(); // ✅ Fetch event ID dynamically
    this.initPaypalConfig(); // ✅ Initialisation PayPal

    // ✅ Vérifier si le paiement est réussi après redirection PayPal
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    const payerId = urlParams.get('PayerID');

    if (paymentId && payerId) {
      this.capturePaypalPayment(paymentId, payerId);
    }
  }

  initForm(): void {
    this.reservationForm = this.fb.group({
      nomPassager: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
      numeroPasseport: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      modePaiement: ['', Validators.required],
      cardNumber: ['', [Validators.pattern('^[0-9]{16}$')]],
      cardExpiry: ['', [Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cardCVC: ['', [Validators.pattern('^[0-9]{3,4}$')]],
      paypalEmail: ['', [Validators.email]]
    });
  }

 // Récupérer l'utilisateur actuel depuis le CurrentuserService
retrieveUserId(): void {
  this.currentuserService.getCurrentUser().subscribe((user) => {
    if (user && user.id !== undefined) {
      this.userId = user.id;
      console.log('✅ Current user loaded:', user);
      // Remplir le formulaire avec les données de l'utilisateur
      this.reservationForm.patchValue({
        nomPassager: user.username,
        email: user.email
      });
    } else {
      console.warn('⚠️ No user logged in or user ID undefined, using default value');
      // Essayer de récupérer l'ID depuis les paramètres d'URL comme fallback
      const userIdParam = this.route.snapshot.queryParamMap.get('userId');
      if (userIdParam && !isNaN(+userIdParam)) {
        this.userId = +userIdParam;
      } else {
        // Si aucun utilisateur n'est trouvé, utiliser l'ID par défaut
        console.warn('❌ Aucun ID utilisateur trouvé ou invalide. Utilisation de l\'ID par défaut (2).');
        this.userId = 2; // ID utilisateur par défaut
      }
    }
  });
}
  // Retrieve event ID from route params
  retrieveEventId(): void {
    this.route.paramMap.subscribe(params => {
      const eventIdParam = params.get('eventId');
      if (eventIdParam && !isNaN(+eventIdParam)) {
        this.eventId = +eventIdParam;
        this.getEventDetails(this.eventId);
      } else {
        console.error('❌ Aucun ID de event trouvé ou invalide.');
      }
    });
  }

  // Fetch event details by event ID
  getEventDetails(eventId: number): void {
    this.eventService.getEventById(eventId).subscribe(
      (response) => {
        console.log('Event details:', response);
        this.eventDetails = response;
      },
      (error) => {
        console.error('❌ Erreur lors de la récupération des détails de l\'événement:', error);
      }
    );
  }

  // Select payment method
  selectPaymentMethod(method: ModePaiement): void {
    this.selectedPayment = method;
    this.reservationForm.patchValue({ modePaiement: method });
  }

  // Start card payment
  startCardPayment(): void {
    if (this.reservationForm.invalid) {
      console.warn("❌ Formulaire invalide !");
      return;
    }

    console.log("📡 Paiement par carte validé !");
    this.submitReservation();
  }

  // Start PayPal payment
  startPaypalPayment(): void {
    console.log("✅ Paiement PayPal initié...");
  }

  // Capture PayPal payment after approval
  capturePaypalPayment(paymentId: string, payerId: string): void {
    this.paypalService.capturePayment(paymentId, payerId).subscribe(response => {
      console.log('✅ Paiement capturé côté backend', response);
      this.paymentConfirmed = true;
    }, error => {
      console.error("❌ Erreur de capture PayPal :", error);
    });
  }

  // Submit reservation after successful payment
  submitReservation(): void {
    const reservationData: Reservation = {
      ...this.reservationForm.value,
      userId: this.userId,
      eventId: this.eventId
    };

    this.router.navigate(['/front-office', 'confirmationevent'], {
      queryParams: {
        reservationData: encodeURIComponent(JSON.stringify(reservationData)),
        eventDetails: encodeURIComponent(JSON.stringify(this.eventDetails))
      }
    });
  }

  // Navigate to home page
  goToHome(): void {
    this.router.navigate(['/']); // ✅ Redirection vers la page d’accueil
  }

  // Initialize PayPal config
  private initPaypalConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'Ae5zVR7mRotPqnZT6GSsyADz7rCpFd1oGqjVn-A1FKU1S9AT3oBEgvV4bv0jcogVQoQK2-5bf13Irhg4', // ✅ Remplace par ton vrai Client ID
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: String(this.eventDetails.prix), // ✅ Montant dynamique basé sur le event
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: String(this.eventDetails.prix)
              }
            }
          },
          items: [{
            name: 'Billet avion',
            quantity: '1',
            unit_amount: {
              currency_code: 'USD',
              value: String(this.eventDetails.prix),
            },
          }]
        }]
      },
      onApprove: (data, actions) => {
        console.log('✅ Transaction approuvée !', data);
        actions.order.get().then((details: any) => {
          console.log('📌 Détails complets de la commande : ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('✅ Transaction terminée !', data);
        this.paymentConfirmed = true;
        alert("Paiement réussi !");
      },
      onCancel: (data) => {
        console.log('❌ Paiement annulé.', data);
      },
      onError: err => {
        console.log('❌ Erreur PayPal.', err);
      }
    };
  }

  // Generate PDF for reservation confirmation
  generatePDF(): void {
    const doc = new jsPDF();
    const element = document.getElementById('recapitulatif'); // ✅ Capture l'élément HTML contenant les infos

    if (element) {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 10, 190, 100);
        doc.save('confirmation_reservation.pdf'); // ✅ Génère le fichier PDF
      });
    } else {
      console.error("❌ Élément introuvable pour générer le PDF.");
    }
  }
}
