import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RewardPoints } from 'src/app/front-office/models/RewardPoints';
import { RewardPointsService } from 'src/app/front-office/services/reward-points/reward-points.service';

@Component({
  selector: 'app-get-by-user',
  templateUrl: './get-points-by-user.component.html',
  styleUrl: './get-points-by-user.component.scss'
})
export class GetPointsByUserComponent implements OnInit {
  points!: RewardPoints;
  id!: number;
  promoCode!: string;
  showError: boolean = false;

  constructor(private _pointsService: RewardPointsService, private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this._activatedRoute.snapshot.params['id'];
    this._pointsService.getByUser(this.id).subscribe({
      next: (res) => this.points = res,
      error: (err) => console.error('Error fetching points', err)
    })
  }

  getPromoCode() {
    this.showError = this.points?.points === 0;
    if (this.points.points !== 0) {
      this._pointsService.getPromoCode(this.id).subscribe({
        next: (res) => {
          this.promoCode = res.token;
          this.points = res.points
        },
        error: (err) => console.error('Error getting promo code', err)
      })
    }

  }

}
