import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paiement } from 'src/app/front-office/models/Paiement';
import { PaiementService } from 'src/app/front-office/services/paiement/paiement.service';

@Component({
  selector: 'app-paiement-detail-back',
  templateUrl: './paiement-detail.component.html',
  styleUrl: './paiement-detail.component.scss'
})
export class PaiementDetailComponent implements OnInit{
  paiement!: Paiement;
  id!: number;
  constructor(private _paiementService: PaiementService, private _activatedRoute: ActivatedRoute){}
  ngOnInit(): void {
    this.id = this._activatedRoute.snapshot.params['id'];
    this._paiementService.findById(this.id).subscribe({
      next: (res) => this.paiement = res,
      error: (err) => console.error('Error fetching paiement:', err),
    })
  }
}
