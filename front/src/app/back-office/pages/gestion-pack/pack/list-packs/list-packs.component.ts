import { Component, OnInit } from '@angular/core';
import { Pack } from 'src/app/front-office/models/pack';
import { PackService } from 'src/app/front-office/services/pack/pack.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-packs',
  templateUrl: './list-packs.component.html',
  styleUrl: './list-packs.component.css'
})
export class ListPacksComponent implements OnInit{

  listPacks: Pack[] = [];
  imageBaseUrl: string = environment.apiBaseUrl + '/uploads/';
  
  constructor(private _packService:PackService){}
  ngOnInit(): void {
    this._packService.findAll().subscribe({
      next:(res) => {this.listPacks = res;console.log(this.listPacks);},
      error: (err) => console.error('Error fetching packs:', err)
    })

    
  }
removePack(id:number,index:number){
  this._packService.delete(id).subscribe({
    next:(res) => {
      console.log('PAck deleted');
      this.listPacks.splice(index, 1);
    },
    error: (err) => console.error('Error deleting pack:', err)
  })
}

}
