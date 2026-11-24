import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/front-office/models/reservation.model';
import { Event } from 'src/app/front-office/models/evenement.model';
import { ReservationService } from 'src/app/front-office/services/reservation_flight/reservation.service';
import { EmailService } from 'src/app/front-office/services/email/email.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmationevent.component.html',
  styleUrls: ['./confirmationevent.component.scss']
})
export class ConfirmationeventComponent implements OnInit {
  reservationData!: Reservation;
  eventDetails!: Event;
  message: string = '';
  showConfirmationModal: boolean = false;
  showDownloadButton: boolean = false; // Initialisé à false

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['reservationData'] && params['eventDetails']) {
        try {
          this.reservationData = JSON.parse(decodeURIComponent(params['reservationData']));
          this.eventDetails = JSON.parse(decodeURIComponent(params['eventDetails']));
          console.log("📡 Données de réservation récupérées :", this.reservationData);
          console.log("📡 Détails du vol récupérés :", this.eventDetails);
        } catch (error) {
          console.error("❌ Erreur lors du traitement des données JSON :", error);
        }
      } else {
        console.error("❌ Erreur : données de réservation non disponibles !");
      }
    });
  }

  finalizeReservation(): void {
    this.reservationService.reserveEvent(
      this.reservationData.userId as number,
      this.reservationData.eventId as number,
      this.reservationData
    ).subscribe(
      (response: any) => {
        console.log("✅ Réservation confirmée :", response);
        this.message = "✅ Votre réservation a été confirmée avec succès !";
        this.showConfirmationModal = true;
        this.showDownloadButton = true;
  
        // ✅ SweetAlert de succès
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Votre réservation a été confirmée avec succès.',
          timer: 2500,
          showConfirmButton: false,
          background: '#f0fff0',
          color: '#2e7d32',
          iconColor: '#43a047',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-text'
          }
        });
  
        // ✅ Envoi du mail après la confirmation
        this.sendConfirmationEmail();
      },
      (error: any) => {
        console.error("❌ Erreur API :", error);
        this.message = "❌ Une erreur est survenue lors de la confirmation.";
  
        // ❌ SweetAlert d’erreur
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la confirmation.',
          background: '#fff5f5',
          color: '#c62828',
          iconColor: '#e53935',
        });
      }
    );
  }
  
  
  generatePDF(): void {
    const doc = new jsPDF();
  
    // Ajouter le titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Récapitulatif de Confirmation", 10, 10);
  
    // Ajouter les détails du vol
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`✈️ event: ${this.eventDetails.title}`, 10, 30);
    doc.text(`emp: ${this.eventDetails.location}`, 10, 40);
    doc.text(`🕒 date: ${this.eventDetails.startDateTime}`, 10, 50);
    doc.text(`🕒 date: ${this.eventDetails.endDateTime}`, 10, 50);
    doc.text(`💰 Prix: ${this.eventDetails.prix} USD`, 10, 60);
  
    // Ajouter les détails de la réservation
    doc.text(`👤 Passager: ${this.reservationData.nomPassager}`, 10, 80);
    doc.text(`🛂 Passeport: ${this.reservationData.numeroPasseport}`, 10, 90);
    doc.text(`💳 Mode de paiement: ${this.reservationData.modePaiement}`, 10, 100);
    doc.text(`📧 Email: ${this.reservationData.email}`, 10, 110);
  
    // Sauvegarde et téléchargement du fichier PDF
    doc.save("confirmation_reservation.pdf");
  }
  
  
  startPDFDownload(): void {
    setTimeout(() => {
      this.generatePDF();
    }, 3000); // ✅ Attendre 3 secondes pour laisser l’animation jouer
  }
  

  sendConfirmationEmail(): void {
    if (!this.reservationData?.email) {
      console.warn("⚠️ Aucun e-mail trouvé, envoi annulé.");
      return;
    }

    const emailPayload = {
      to: this.reservationData.email,
      subject: "Confirmation de votre réservation",
      body: `Bonjour ${this.reservationData.nomPassager},

Votre réservation pour le vol ${this.eventDetails.title} avec ${this.eventDetails.location} a été confirmée avec succès ! 🎉

Merci pour votre confiance.

Cordialement,
L'équipe de réservation`,
      attachment: 'confirmation_reservation.pdf' // ✅ Ajout du PDF généré en pièce jointe
    };

    this.emailService.sendEmail(emailPayload).subscribe(
      (response: any) => {
        console.log("✅ Réponse API :", response);
      },
      (error: any) => {
        console.error("❌ Erreur API :", error);
      }
    );
  }

  goToHome(): void {
    this.showConfirmationModal = false;
    this.router.navigate(['/home']);
  }
}
