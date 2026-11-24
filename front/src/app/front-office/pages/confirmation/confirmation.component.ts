import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/front-office/models/reservation.model';
import { Vol } from 'src/app/front-office/models/vol.model';
import { ReservationService } from 'src/app/front-office/services/reservation_flight/reservation.service';
import { EmailService } from 'src/app/front-office/services/email/email.service';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import { CurrentuserService } from 'src/app/services/gestionUser/service_me/currentuser.service';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  reservationData!: Reservation;
  volDetails: Vol = {} as Vol;
  message: string = '';
  showConfirmationModal: boolean = false;
  showDownloadButton: boolean = false;
  userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private emailService: EmailService,
    private currentuserService: CurrentuserService
  ) {}
  
  ngOnInit(): void {
    // Récupérer l'utilisateur actuel
    this.currentuserService.getCurrentUser().subscribe((user) => {
      if (user && user.id !== undefined) {
        this.userId = user.id;
        console.log('✅ Current user loaded in confirmation:', user);
      } else {
        console.warn('⚠️ No user logged in or user ID undefined in confirmation');
      }
      
      // Continuer avec le traitement des données de réservation
      this.processReservationData();
    }, error => {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur actuel:', error);
      // En cas d'erreur, continuer avec le traitement des données de réservation
      this.processReservationData();
    });
  }

  processReservationData(): void {
    this.route.queryParams.subscribe(params => {
      if (params['reservationData']) {
        try {
          this.reservationData = JSON.parse(decodeURIComponent(params['reservationData']));
          
          // Si l'ID utilisateur a été récupéré, utiliser celui-ci
          if (this.userId > 0) {
            this.reservationData.userId = this.userId;
          }
          
          // ✅ Utilisation cohérente de la propriété vol
          this.volDetails = this.reservationData.vol ?? {} as Vol;
  
          // Vérification plus stricte
          if (!this.volDetails || !this.volDetails.compagnie || !this.volDetails.numeroVol) {
            console.warn("⚠️ Données du vol manquantes ou incomplètes !", this.volDetails);
            this.volDetails = {
              compagnie: "Non spécifiée",
              numeroVol: "Non spécifié",
              dateDepart: "Non spécifié",
              prix: 0,
              // ... autres champs par défaut
            } as Vol;
          }
  
          console.log("📡 Détails du vol récupérés :", this.volDetails);
        } catch (error) {
          console.error("❌ Erreur de parsing JSON :", error);
          this.router.navigate(['/error'], { state: { error: "Données de réservation invalides" } });
        }
      } else {
        console.error("❌ Aucune donnée de réservation reçue !");
        this.router.navigate(['/reservation']);
      }
    });
  }generatePDF(): void {
    if (!this.volDetails || !this.reservationData) {
      console.error("❌ Impossible de générer le PDF : données manquantes.");
      return;
    }
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Couleurs thématiques
    const primaryColor = [41, 128, 185]; // Bleu clair
    const secondaryColor = [52, 73, 94]; // Gris foncé
    const accentColor = [26, 188, 156]; // Turquoise
    
    // En-tête avec dégradé
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    // Logo de compagnie aérienne stylisé (simulé avec un texte)
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(" AIR VOYAGE", pageWidth / 2, 15, { align: 'center' });
    
    // Bannière de confirmation
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.roundedRect(20, 35, pageWidth - 40, 15, 3, 3, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("CONFIRMATION DE RÉSERVATION", pageWidth / 2, 44, { align: 'center' });
    
    // Informations de vol dans un cadre élégant
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, 60, pageWidth - 40, 50, 2, 2, 'S');
    
    // Titre de la section vol
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(25, 60, 70, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("DÉTAILS DU VOL", 60, 65.5, { align: 'center' });
    
    // Détails du vol
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const iconColor = `rgb(${primaryColor[0]},${primaryColor[1]},${primaryColor[2]})`;
    const volY = 75;
    doc.setFont("helvetica", "bold");
    doc.text("Compagnie:", 25, volY);
    doc.setFont("helvetica", "normal");
    doc.text(`${this.volDetails.compagnie ?? "Non spécifiée"}`, 70, volY);
    
    doc.setFont("helvetica", "bold");
    doc.text("N° Vol:", 25, volY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`${this.volDetails.numeroVol ?? "Non spécifié"}`, 70, volY + 10);
    
    doc.setFont("helvetica", "bold");
    doc.text("Date de départ:", 25, volY + 20);
    doc.setFont("helvetica", "normal");
    doc.text(`${this.volDetails.dateDepart ?? "Non spécifié"}`, 70, volY + 20);
    
    doc.setFont("helvetica", "bold");
    doc.text("Prix:", 25, volY + 30);
    doc.setFont("helvetica", "normal");
    doc.text(`${this.volDetails.prix ?? "Non spécifié"} USD`, 70, volY + 30);
    
    // Informations passager
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(20, 120, pageWidth - 40, 60, 2, 2, 'S');
    
    // Titre de la section passager
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(25, 120, 95, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("INFORMATIONS PASSAGER", 72.5, 125.5, { align: 'center' });
    
    // Détails du passager
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(11);
    const passagerY = 135;
    
    doc.setFont("helvetica", "bold");
    doc.text("Nom du passager:", 25, passagerY);
    doc.setFont("helvetica", "normal");
    doc.text(`${this.reservationData.nomPassager ?? ""}`, 90, passagerY);
    
    doc.setFont("helvetica", "bold");
    doc.text("N° Passeport:", 25, passagerY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`${this.reservationData.numeroPasseport ?? ""}`, 90, passagerY + 10);
    
    doc.setFont("helvetica", "bold");
    doc.text("Email:", 25, passagerY + 20);
    doc.setFont("helvetica", "normal");
    doc.text(`${this.reservationData.email ?? ""}`, 90, passagerY + 20);
    
    doc.setFont("helvetica", "bold");
    doc.text("Mode de paiement:", 25, passagerY + 30);
    doc.setFont("helvetica", "normal");
    doc.text(`${this.reservationData.modePaiement ?? ""}`, 90, passagerY + 30);
    
    // Section Confirmation avec QR Code simulé
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, 190, pageWidth - 40, 40, 2, 2, 'S');
    
    // QR Code simulé (un simple carré noir)
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(pageWidth - 65, 195, 30, 30, 1, 1, 'F');
    
    // Texte de confirmation
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("✅ RÉSERVATION CONFIRMÉE", 30, 205);
    
    // Numéro de confirmation
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    const confirmationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    doc.text(`N° de confirmation: ${confirmationCode}`, 30, 215);
    
    // Pied de page
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("Ce document est une confirmation officielle de votre réservation.", pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    
    // Enregistrement du PDF
    doc.save("confirmation_reservation.pdf");
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

Votre réservation pour le vol ${this.volDetails.numeroVol ?? "Non spécifié"} avec ${this.volDetails.compagnie ?? "Non spécifiée"} a été confirmée avec succès ! 🎉

Merci pour votre confiance.

Cordialement,
L'équipe de réservation`,
      attachment: 'confirmation_reservation.pdf'
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
  
  finalizeReservation(): void {
    // Utiliser l'ID utilisateur récupéré
    const userIdToUse = this.userId > 0 ? this.userId : (this.reservationData.userId as number);
    
    console.log(`📡 Finalisation de la réservation avec userId: ${userIdToUse}, volId: ${this.reservationData.volId}`);
    
    this.reservationService.createReservation(
      userIdToUse,
      this.reservationData.volId as number,
      this.reservationData
    ).subscribe(
      (response: any) => {
        console.log("✅ Réservation confirmée :", response);
        
        // Ajouter manuellement les détails du vol à la réponse si nécessaire
        if (!response.vol && this.volDetails) {
          response.vol = this.volDetails;
        }
        
        this.message = "✅ Votre réservation a été confirmée avec succès !";
        this.showConfirmationModal = true;
        this.showDownloadButton = true;
  
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Votre réservation a été confirmée avec succès.',
          timer: 2500,
          showConfirmButton: false
        });
  
        this.sendConfirmationEmail();
      },
      (error: any) => {
        console.error("❌ Erreur API :", error);
        this.message = "❌ Une erreur est survenue lors de la confirmation.";
      }
    );
  }
  
  goToHome(): void {
    this.showConfirmationModal = false;
    this.router.navigate(['/home']);
  }
}