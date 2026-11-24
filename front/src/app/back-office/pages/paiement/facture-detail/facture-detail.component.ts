import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/front-office/models/Facture';
import { FactureService } from 'src/app/front-office/services/facture/facture.service';

@Component({
  selector: 'app-facture-detail-back',
  templateUrl: './facture-detail.component.html',
  styleUrl: './facture-detail.component.scss'
})
export class FactureDetailComponent implements OnInit{
  facture!: Facture;
  id!: number;
  constructor(private _factureService: FactureService, private _activatedRoute: ActivatedRoute, private _router: Router){}
  ngOnInit(): void {
    this.id = this._activatedRoute.snapshot.params['id'];
    this._factureService.findById(this.id).subscribe({
      next: (data) => {this.facture = data},
      error: (err) => console.error('Error fetching facture:', err),

    })
  }

}
