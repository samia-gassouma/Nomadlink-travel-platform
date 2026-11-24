import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaypalService } from 'src/app/front-office/services/paypal/paypal.service';
import { HttpClient } from '@angular/common/http';
import { Reservation, ModePaiement } from 'src/app/front-office/models/reservation.model';
import { Vol } from 'src/app/front-office/models/vol.model';
import { FlightService } from 'src/app/front-office/services/flight/flight.service';
import { ReservationService } from 'src/app/front-office/services/reservation_flight/reservation.service';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ReactiveFormsModule } from '@angular/forms';
import { UserControllerService } from 'src/app/services/gestionUser/services';
//
import { CurrentuserService } from 'src/app/services/gestionUser/service_me/currentuser.service';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservationForm!: FormGroup;
  userId: number = 2; // Valeur par défaut
  volId!: number;
  message: string = '';
  @Input() updateStep!: (etape: string) => void;
  volDetails: Vol = {} as Vol;
  selectedPayment: ModePaiement = ModePaiement.Virement;
  paymentConfirmed: boolean = false;
  public payPalConfig?: IPayPalConfig;

  ModePaiement = ModePaiement;

  constructor(
    private fb: FormBuilder,
    private paypalService: PaypalService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private userService: UserControllerService,
    private reservationService: ReservationService,
    private currentuserService: CurrentuserService // Ajoutez cette ligne

  ) {}

  ngOnInit(): void {
    this.initForm();
    this.retrieveVolId();
    this.initPaypalConfig();
    this.updateStep('reservation');


    /*
    // Try to get user ID from URL or default to 2
    const userIdParam = this.route.snapshot.queryParamMap.get('userId');
    if (userIdParam && !isNaN(+userIdParam)) {
      this.userId = +userIdParam;
    }

    // Fetch user details based on the userId
    this.getUserDetails(this.userId);
*/
  // Remplacez la récupération statique du userId par le currentUser
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
      }
      /*
      // Si toujours pas d'ID, utiliser getUserDetails pour récupérer les informations
      this.getUserDetails(this.userId);
      */
    }
  });
    // Vérifier si le paiement est réussi après redirection PayPal
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

  retrieveVolId(): void {
    this.route.paramMap.subscribe(params => {
      const volIdParam = params.get('volId');
      if (volIdParam && !isNaN(+volIdParam)) {
        this.volId = +volIdParam;
        this.getVolDetails(this.volId);
      } else {
        console.error('❌ Aucun ID de vol trouvé ou invalide.');
      }
    });
  }

  getVolDetails(volId: number): void {
    this.flightService.getFlightById(volId.toString()).subscribe(
      (response) => {
        this.volDetails = response;
        console.log("✅ Détails du vol récupérés :", this.volDetails);
      },
      (error) => {
        console.error('❌ Erreur lors de la récupération des détails du vol:', error);
      }
    );
  }
/*
  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        console.log('✅ User details fetched:', user);
        // You can populate form fields with the user data if needed
        this.reservationForm.patchValue({
          nomPassager: user.username, // Assuming user has a name property
          email: user.email // Assuming user has an email property
        });
      },
      (error) => {
        console.error('❌ Erreur lors de la récupération des détails de l\'user:', error);      }
    );
  }
*/
  selectPaymentMethod(method: ModePaiement): void {
    this.selectedPayment = method;
    this.reservationForm.patchValue({ modePaiement: method });
  }

  startCardPayment(): void {
    if (this.reservationForm.invalid) {
      console.warn("❌ Formulaire invalide !");
      return;
    }

    console.log("📡 Paiement par carte validé !");
    this.submitReservation();
  }

  startPaypalPayment(): void {
    console.log("✅ Paiement PayPal initié...");
  }

  capturePaypalPayment(paymentId: string, payerId: string): void {
    this.paypalService.capturePayment(paymentId, payerId)
      .subscribe(response => {
        console.log('✅ Paiement capturé côté backend', response);
        this.paymentConfirmed = true;
      }, error => {
        console.error("❌ Erreur de capture PayPal :", error);
      });
  }

  submitReservation(): void {
    const reservationData: Reservation = {
      ...this.reservationForm.value,
      userId: this.userId,
      volId: this.volId,
      vol: this.volDetails // ✅ Modification de volDetails à vol pour assurer la cohérence
    };

    this.router.navigate(['/front-office','confirmation'], {
      queryParams: {
        reservationData: encodeURIComponent(JSON.stringify(reservationData))
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['front-office/home-v2']);
  }

  private initPaypalConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'Ae5zVR7mRotPqnZT6GSsyADz7rCpFd1oGqjVn-A1FKU1S9AT3oBEgvV4bv0jcogVQoQK2-5bf13Irhg4',
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: String(this.volDetails.prix),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: String(this.volDetails.prix)
              }
            }
          },
          items: [{
            name: 'Billet avion',
            quantity: '1',
            unit_amount: {
              currency_code: 'USD',
              value: String(this.volDetails.prix),
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
  
  getReservationsWithFlightDetails(): void {
    this.reservationService.getAllReservations().subscribe((reservations: Reservation[]) => {
      reservations.forEach((reservation: Reservation) => {
        if (reservation.volId) {
          this.flightService.getFlightById(reservation.volId.toString()).subscribe(
            (vol: Vol) => {
              reservation.vol = vol; // ✅ Modification de volDetails à vol pour assurer la cohérence
              console.log("✅ Détails du vol ajoutés à la réservation :", reservation);
            },
            (error) => {
              console.error("❌ Erreur lors de la récupération des détails du vol :", error);
            }
          );
        }
      });
  
      console.log("✅ Réservations avec détails du vol :", reservations);
    });
  }
  
  generatePDF(): void {
    const doc = new jsPDF();
    const element = document.getElementById('recapitulatif');

    if (element) {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 10, 190, 100);
        doc.save('confirmation_reservation.pdf');
      });
    } else {
      console.error("❌ Élément introuvable pour générer le PDF.");
    }
  }
}