import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Commande} from "../../../../../front-office/models/boutique/commande.model";

@Component({
  selector: 'app-updateorder',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './updateorder.component.html',
  styleUrl: './updateorder.component.scss'
})
export class UpdateorderComponent {
  @Input() commande!: Commande;
  @Output() commandeModifiee = new EventEmitter<Commande>();

  modifierCommande() {
    this.commandeModifiee.emit(this.commande);
  }
}
