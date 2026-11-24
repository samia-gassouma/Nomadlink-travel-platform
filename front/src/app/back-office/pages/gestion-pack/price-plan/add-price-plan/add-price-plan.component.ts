import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PricePlan, PricePlanType } from 'src/app/front-office/models/PricePlan';
import { PricePlanService } from 'src/app/front-office/services/price-plan/price-plan.service';

@Component({
  selector: 'app-add-price-plan',
  templateUrl: './add-price-plan.component.html',
  styleUrl: './add-price-plan.component.css'
})
export class AddPricePlanComponent implements OnInit {

  pricePlanTypes = Object.values(PricePlanType);
  packId!: number;
  isEditMode: boolean = false;
  pricePlanId!: number;
  pricePlan?: PricePlan;
  pricePlanForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)])
  })
  constructor(private _pricePlanService: PricePlanService, private _activatedRoute: ActivatedRoute, private _router: Router) { }
  ngOnInit(): void {

    this.packId = this._activatedRoute.snapshot.params['id'];
    if (this._router.url.includes('/update')) {
      this.isEditMode = true;
      this.pricePlanId = this._activatedRoute.snapshot.params['id'];
      this._pricePlanService.getById(this.pricePlanId).subscribe({
        next: (res) => {
          this.pricePlan = res;
          console.log(this.pricePlan);
          this.packId = this.pricePlan.pack?.id!;
          this.pricePlanForm.patchValue({
            name: this.pricePlan.name,
            description: this.pricePlan.description,
            price: this.pricePlan.price.toString()
          });
        },
        error: (err) => console.error('Error fetching price plan:', err),
      })
    } else {
      this.isEditMode = false;
    }

  }

  submitForm(): void {
    if (this.pricePlanForm.valid) {
      console.log('Form Submitted:', this.pricePlanForm.value);
      const formValue = this.pricePlanForm.value;
      const nameStr: string = formValue.name ?? 'Basic';
      const pricePlanName: PricePlanType = PricePlanType[nameStr as keyof typeof PricePlanType];
      const pricePlan: PricePlan = {
        id: 0, // if id is optional
        name: pricePlanName,
        description: formValue.description ?? '', // ensure it's a string
        price: parseFloat(formValue.price ?? '0'), // safely parse float
      };
      if (!this.isEditMode) {
        this._pricePlanService.save(pricePlan, this.packId).subscribe({
          next: (res) => {
            console.log("Price plan submitted");
            this._router.navigate(['/back-office/packs/price-plan','get',res.id]);
          },
          error: (err) => console.error('Error adding price plan:', err),
        })
      }
      else {
        this._pricePlanService.update(pricePlan,this.pricePlanId).subscribe({
          next: (res) => {
            console.log("Price plan updated");
            this._router.navigate(['/back-office/packs/pack','get',this.pricePlanId])
          },
          error: (err) => console.error('Error updating price plan:', err),
        })
      }
    } else {
      console.log('Form Invalid');
    }
    
  }

}
