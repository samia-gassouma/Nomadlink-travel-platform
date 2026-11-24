import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pack } from 'src/app/front-office/models/pack';
import { PackAssociation } from 'src/app/front-office/models/PackAssociation';
import { PackService } from 'src/app/front-office/services/pack/pack.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pack-details',
  templateUrl: './pack-details.component.html',
  styleUrl: './pack-details.component.css'
})
export class PackDetailsComponent implements OnInit{

  packId!: number;
  packAssociationList!: PackAssociation[];
  pack?:Pack;
  prices:number[] = [];
  imageBaseUrl: string = environment.apiBaseUrl + '/uploads/';
  constructor(private _activatedRoute: ActivatedRoute,private _packService: PackService){}
  ngOnInit(): void {
    this.packId = this._activatedRoute.snapshot.params['id'];
    this._packService.getById(this.packId).subscribe({
      next: (res) => {this.packAssociationList = res;
        this.pack = this.packAssociationList[0].pack;
        if(this.pack.discount && this.pack.pricePlans && Array.isArray(this.pack.pricePlans)){
          const reduction_percent = this.pack.discount.reduction_percent;
          for(let p of this.pack.pricePlans){
            // Calculate the discounted price and push it to the prices array
            this.prices.push(p.price - (p.price * reduction_percent / 100));
            console.log("prices====",this.prices);
            console.log("p.price====",p.price,"reduction====",reduction_percent);
          }
        }
        console.log("pack===",this.pack);
      },
      error: (err) => console.error("Error fetching discount:", err)        
    })

  }


}
