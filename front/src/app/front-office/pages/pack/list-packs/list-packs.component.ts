import { Component, OnInit } from '@angular/core';
import { interval, map } from 'rxjs';
import { Pack } from 'src/app/front-office/models/pack';
import { DiscountService } from 'src/app/front-office/services/discount/discount.service';
import { PackService } from 'src/app/front-office/services/pack/pack.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-packs',
  templateUrl: './list-packs.component.html',
  styleUrl: './list-packs.component.css'
})
export class ListPacksComponent implements OnInit{

  listPacks: Pack[] = []
  year: number = new Date().getFullYear();
  private _trialEndsAt: any;
  private _diff?: any;
  _days?: number;
  _hours?: number;
  _minutes?: number;
  _seconds?: number;
  imageBaseUrl: string = environment.apiBaseUrl + '/uploads/';
  constructor(private _packService:PackService,private _discountService: DiscountService){}
  ngOnInit(): void {
    this._discountService.getMaxDate().subscribe({
      next: (res) => this._trialEndsAt = res,
      error: (err) => console.error('Error getting maxdate:', err)

    })
    this._packService.findAll().subscribe({
      next:(res) => this.listPacks = res,
      error: (err) => console.error('Error fetching packs:', err)
    })
        interval(1000).pipe(map((x) => {
            this._diff = Date.parse(this._trialEndsAt) - Date.parse(new Date().toString());
        })).subscribe((x) => {
            this._days = this.getDays(this._diff);
            this._hours = this.getHours(this._diff);
            this._minutes = this.getMinutes(this._diff);
            this._seconds = this.getSeconds(this._diff);
        });
  }

   /**
   * Day Set
   */
   getDays(t: number) {
    return Math.floor(t / (1000 * 60 * 60 * 24));
  }

  /**
   * Hours Set
   */
  getHours(t: number) {
    return Math.floor((t / (1000 * 60 * 60)) % 24);
  }

  /**
   * Minutes set
   */
  getMinutes(t: number) {
    return Math.floor((t / 1000 / 60) % 60);
  }

  /**
   * Secound set
   */
  getSeconds(t: number) {
    return Math.floor((t / 1000) % 60);
  }


}
