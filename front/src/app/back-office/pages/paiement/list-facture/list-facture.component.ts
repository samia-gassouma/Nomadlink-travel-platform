import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/front-office/models/Facture';
import { FactureService } from 'src/app/front-office/services/facture/facture.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-facture',
  templateUrl: './list-facture.component.html',
  styleUrl: './list-facture.component.scss'
})
export class ListFactureComponent implements OnInit{
  listFactures!: Facture[];
  id?: number;
  backoffice: boolean = false;
  imageBaseUrl: string = environment.apiBaseUrl + '/uploads/';
  
  constructor(private _factureService: FactureService, private _activatedRoute: ActivatedRoute, private _router: Router){}
  ngOnInit(): void {
    if(this._router.url.includes('back-office'))
    {
      this.backoffice = true;
    }

    this.id = this._activatedRoute.snapshot.params['id'];
    if(this.id){
      this._factureService.findByUser(this.id).subscribe({
        next: (data) => this.listFactures = data,
        error: (err) => console.error('Error fetching factures:', err),
      })
    }
    else{
      this._factureService.findAll().subscribe({
        next: (data) => this.listFactures = data,
        error: (err) => console.error('Error fetching factures:', err),
      })
    }
  }

  delete(id:number, index:number){
    if (confirm('Are you sure you want to delete this paiement?')) {
      // Call your service to delete
      this._factureService.delete(id).subscribe(() => {
        this.listFactures = this.listFactures.splice(index, 1);
      });
    }
  }

}
