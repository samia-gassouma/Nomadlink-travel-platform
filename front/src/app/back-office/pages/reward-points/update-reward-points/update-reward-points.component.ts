import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RewardPointsService } from 'src/app/front-office/services/reward-points/reward-points.service';
import { RewardPoints } from 'src/app/front-office/models/RewardPoints';

@Component({
  selector: 'app-update-reward-points',
  templateUrl: './update-reward-points.component.html',
  styleUrl: './update-reward-points.component.scss'
})
export class UpdateRewardPointsComponent implements OnInit{

  updatePoints!: FormGroup;
  id!: number;
  reward_points!: RewardPoints;
  counter = 0;
  increment() {
    this.counter++;
  }

  decrement() {
    this.counter--;
  }

  constructor(private _pointsService: RewardPointsService,private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute){
    this.id = _activatedRoute.snapshot.params['id'];
    this._pointsService.getById(this.id).subscribe({
      next: (res) => {
        this.reward_points = res;

        this.updatePoints = _formBuilder.group({
          points: this.reward_points.points,
          is_active: this.reward_points.is_active,
          token: this.reward_points.token

        })
      },
      error: (err) => console.error('Error fetching points:', err),

    })
    

  }
  ngOnInit(): void {

  }

  submitForm(){
    this._pointsService.update(this.id, this.reward_points).subscribe({

    })
  }
  

}
