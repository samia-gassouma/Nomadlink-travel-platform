import { Component, OnInit } from '@angular/core';
import { PricePlan } from 'src/app/front-office/models/PricePlan';
import { PricePlanService } from 'src/app/front-office/services/price-plan/price-plan.service';

@Component({
  selector: 'app-list-price-plans',
  templateUrl: './list-price-plans.component.html',
  styleUrl: './list-price-plans.component.css'
})
export class ListPricePlansComponent implements OnInit{
  listPricePlan!: PricePlan[];
  constructor(private _pricePlanService: PricePlanService){}
  ngOnInit(): void {
    this._pricePlanService.findAll().subscribe({
      next: (res) => {this.listPricePlan = res; console.log(this.listPricePlan);},
      error: (err) => console.error('Error fetching price plans', err),
    })
  }

  remove(id: number, index: number){
    this._pricePlanService.delete(id).subscribe({
      next: (res) => this.listPricePlan.splice(index,1),
      error: (err) => console.error('Error deleting price plans', err),
    })
  }

}
