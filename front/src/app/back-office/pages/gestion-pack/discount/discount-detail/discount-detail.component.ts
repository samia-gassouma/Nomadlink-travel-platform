import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Discount } from 'src/app/front-office/models/discount';
import { DiscountService } from 'src/app/front-office/services/discount/discount.service';

@Component({
  selector: 'app-discount-detail',
  templateUrl: './discount-detail.component.html',
  styleUrl: './discount-detail.component.css'
})
export class DiscountDetailComponent implements OnInit{
  discountId!:number;
  discount!:Discount;

  constructor(private activatedroute: ActivatedRoute, private _discountService:DiscountService){}

  ngOnInit(): void {
    this.discountId = this.activatedroute.snapshot.params['id'] || '';
    this._discountService.getById(this.discountId).subscribe({
      next: (res) => this.discount = res,
      error: (err) => console.error("Error fetching discount:", err)
    })
  }

}
