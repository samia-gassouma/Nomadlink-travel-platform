import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Paiement } from 'src/app/front-office/models/Paiement';
import { PaiementService } from 'src/app/front-office/services/paiement/paiement.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-paiement',
  templateUrl: './list-paiement.component.html',
  styleUrl: './list-paiement.component.scss'
})
export class ListPaiementComponent implements OnInit{

  listPaiements!: Paiement[];
  id?: number;
  backoffice: boolean = false;
  imageBaseUrl: string = environment.apiBaseUrl + '/uploads/';

  constructor(private _paiementService : PaiementService, private _activatedRoute: ActivatedRoute, private _router: Router){}
  ngOnInit(): void {
    if(this._router.url.includes('back-office'))
      {
        this.backoffice = true;
      }
    this.id = this._activatedRoute.snapshot.params['id'];
    if(this.id){
      this._paiementService.findByUser(this.id).subscribe({
        next: (data) => this.listPaiements = data,
        error: (err) => console.error('Error fetching paiements:', err),
      })
    }
    else{
      this._paiementService.findAll().subscribe({
        next: (data) => {this.listPaiements = data;console.log(this.listPaiements)},
        error: (err) => console.error('Error fetching paiements:', err),
      })
    }

  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this paiement?')) {
      // Call your service to delete
      this._paiementService.delete(id).subscribe(() => {
        this.listPaiements = this.listPaiements.filter(p => p.id !== id);
      });
    }
  }

  exportCSV(){
  
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Payment Data',
      useBom: true,
      noDownload: false,
      headers: ["id", "date", "amount", "product", "orderDate", "amount", "payment", "status"]
    };
    new ngxCsv(this.listPaiements, "payments", options);
  
  
}
  

}
