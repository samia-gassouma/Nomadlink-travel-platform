import { Component, OnInit } from '@angular/core';
import { RewardPoints } from 'src/app/front-office/models/RewardPoints';
import { RewardPointsService } from 'src/app/front-office/services/reward-points/reward-points.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-points',
  templateUrl: './list-points.component.html',
  styleUrl: './list-points.component.scss'
})
export class ListPointsComponent implements OnInit{

  listPoints!:RewardPoints[];
  imageBaseUrl: string = environment.apiBaseUrl + '/uploads/';
  constructor(private _pointsService : RewardPointsService){}
 
  ngOnInit(): void {
    this._pointsService.findAll().subscribe({
      next: (res) => this.listPoints = res,
      error: (err) => console.error('Error fetching points', err)
    })
  }

}
