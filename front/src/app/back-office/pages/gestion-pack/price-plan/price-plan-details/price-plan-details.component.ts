import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PricePlan } from 'src/app/front-office/models/PricePlan';
import { PricePlanService } from 'src/app/front-office/services/price-plan/price-plan.service';

@Component({
  selector: 'app-price-plan-details',
  templateUrl: './price-plan-details.component.html',
  styleUrl: './price-plan-details.component.css'
})
export class PricePlanDetailsComponent implements OnInit{
  pricePlan!:PricePlan;
  pId!:number;
  constructor(private _pricePlanService: PricePlanService, private _activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.pId = this._activatedRoute.snapshot.params['id'] || '';
    this._pricePlanService.getById(this.pId).subscribe({
      next: (res) => {
        this.pricePlan = res;
        console.log(this.pricePlan);
      },
      error: (err) => console.error('Error fetching price plan:', err)
    })
  }

  // Add any methods or properties needed for the component here

}
