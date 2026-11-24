import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import {Commande} from "../../../../../front-office/models/boutique/commande.model";
import {StatutLigneCommande} from "../../../../../front-office/models/boutique/statutLigneCommande.enum";



@Component({
  selector: 'app-orderdetail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbCarouselModule 
  ],
  templateUrl: './orderdetail.component.html',
  styleUrl: './orderdetail.component.scss'
})
export class OrderdetailComponent {
  @Input() commande!: Commande;
  @Output() closePopup = new EventEmitter<void>();
  @Output() statutChanged = new EventEmitter<StatutLigneCommande>();

  statuts = Object.values(StatutLigneCommande);

  // Bindé à [(ngModel)]
  onChangeStatut(newStatut: StatutLigneCommande): void {
    this.commande.statut = newStatut;
    this.statutChanged.emit(newStatut);
  }
}
