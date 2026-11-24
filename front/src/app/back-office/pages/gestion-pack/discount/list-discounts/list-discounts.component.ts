import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Discount } from 'src/app/front-office/models/discount';
import { DiscountService } from 'src/app/front-office/services/discount/discount.service';

@Component({
  selector: 'app-list-discounts',
  templateUrl: './list-discounts.component.html',
  styleUrl: './list-discounts.component.css'
})
export class ListDiscountsComponent implements OnInit{
    // bread crumb items
    breadCrumbItems!: Array<{}>;

  listDiscounts: Discount[] = [];

  constructor(private _discountService:DiscountService,private _router: Router){}

  ngOnInit(){

    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Wizard', active: true }
    ];
    this._discountService.findAll().subscribe({
      next: (res) => {
        this.listDiscounts = res;
        console.log(this.listDiscounts);
      },
      error: (err) => console.error("Error fetching discounts:", err)
    });
  }

  delete(id:number, index:number){
    return this._discountService.delete(id).subscribe({
      next: x => {
        alert('Discount deleted successfully.');
        this.listDiscounts.splice(index,1);
      }
    })
  }

}
