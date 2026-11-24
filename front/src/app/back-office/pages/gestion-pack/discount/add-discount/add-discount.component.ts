import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Pack } from 'src/app/front-office/models/pack';
import { Discount } from 'src/app/front-office/models/discount';
import { PackService } from 'src/app/front-office/services/pack/pack.service';
import { DiscountService } from 'src/app/front-office/services/discount/discount.service';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrl: './add-discount.component.css'
})
export class AddDiscountComponent implements OnInit{
    // bread crumb items
    breadCrumbItems!: Array<{}>;


    
  isEditMode: boolean = false;
  discount?:Discount;
  discountId!:number;
  listPacks: Pack[] = [];

  discountForm = new FormGroup({
    reduction_percent: new FormControl(),
    date_debut: new FormControl(),
    date_fin: new FormControl(),
    pack: new FormControl()
  })


  constructor(private _discountService: DiscountService,private _packService: PackService, private _router:Router, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    if (this._router.url.includes('/update')) { 
          this.isEditMode = true;
          this.discountId = this.activatedRoute.snapshot.params['id'];
        } else {
          this.isEditMode = false;
        }

    this._packService.findAll().subscribe({
      next: (res) => {this.listPacks = res;console.log("packs=",this.listPacks);},
      error: (err) => console.error('Error fetching packs:', err),
    })

    if(this.isEditMode){
      this._discountService.getById(this.discountId).subscribe({
        next: (data) =>{ 
          this.discount = data;
          const selectedPackIds = this.discount.packs?.map(pack => pack.id);

          this.discountForm.patchValue({
            reduction_percent: this.discount.reduction_percent,
            date_debut: this.discount.date_debut,
            date_fin: this.discount.date_fin,
            pack: selectedPackIds
          });
        }
      })
    }
  }


  submitForm(){console.log("submitForm",this.discountForm.value);
    const selectedPacks = this.discountForm.value.pack;
    console.log("selectedPacks=",selectedPacks);
    const discount: Discount = {
      id: 0,
      reduction_percent: this.discountForm.value.reduction_percent as number,
      date_debut: new Date(this.discountForm.value.date_debut).toISOString().slice(0, 19),
      date_fin: new Date(this.discountForm.value.date_fin).toISOString().slice(0, 19),
      packIds: selectedPacks
    };

    if(!this.isEditMode){
      this._discountService.save(discount).subscribe({
        next: (data) => this._router.navigate(['/back-office/packs/discount/get',data.id]),
        error: (err) => console.error('Error adding discount:', err),
      });
    }
    else{
      this._discountService.update(this.discountId,discount).subscribe({
       next: (data) => this._router.navigate(['/back-office/packs/discount/get',this.discountId]),
      }
      );
    }

    console.log("gello");
    console.log(discount);
  }

}
