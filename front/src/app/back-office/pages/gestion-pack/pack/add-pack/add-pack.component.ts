import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { Destination } from 'src/app/front-office/models/Destination';
import { Pack, PackType } from 'src/app/front-office/models/pack';
import { PackAssociation } from 'src/app/front-office/models/PackAssociation';
import { Vol } from 'src/app/front-office/models/vol.model';
import { FlightService } from 'src/app/front-office/services/flight/flight.service';
import { PackService } from 'src/app/front-office/services/pack/pack.service';
import { VolService } from 'src/app/front-office/services/vol/vol.service';
import {DestinationService} from "../../../../../front-office/services/DestinationService";
import {ActivityService} from "../../../../../front-office/services/activity.service";
import {Destination} from "../../../../../front-office/models/destination.model";
import { Activity } from 'src/app/front-office/models/activity.model';

@Component({
  selector: 'app-add-pack',
  templateUrl: './add-pack.component.html',
  styleUrl: './add-pack.component.css'
})
export class AddPackComponent implements OnInit {
  packTypes = Object.entries(PackType).map(([key, value]) => ({ key, value }));
  listDestination: Destination[] = [];
  listActivity: Activity[] = [];
  listVol: Vol[] = [];
  addPackForm!: FormGroup;
  isEditMode: boolean = false;
  packId!: number;
  packAssociationList!: PackAssociation[];
  file!: File;
  packImage?: string;


  showAddButton = true;


  constructor(private _packService: PackService, private _destinationService: DestinationService, private _activityService: ActivityService, private _volService: FlightService, private _formBuilder: FormBuilder, private _router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.packTypes);
    if (this._router.url.includes('/update')) {
      this.isEditMode = true;
      this.packId = this.activatedRoute.snapshot.params['id'];
      this.showAddButton = false;
    } else {
      this.isEditMode = false;
    }

    this._volService.getFlights().subscribe({
      next: (res) => this.listVol = res,
      error: (err) => console.error('Error fetching vols:', err),
    })

    this._destinationService.getAllDestinations().subscribe({
      next: (res) => {
        this.listDestination = res;
        if (this.isEditMode) {
          this.getPackAssociation();
        }
      },
      error: (err) => console.error('Error fetching destinations:', err),
    })

    console.log("listDest", this.listDestination);


    this.addPackForm = this._formBuilder.group({
      pack: this._formBuilder.group({
        packName: [''],
        packDescription: [''],
        packType: [''],
        packImage: [''],
        vol: ['']
      }),
      destinationGroups: this._formBuilder.array([]),
    })



  }

  getImage(event: any) {
    this.file = event.target.files[0];
    console.log("file===", this.file);

  }

  getPackAssociation() {

    this._packService.getById(this.packId).subscribe({
      next: (res) => {
        this.packAssociationList = res;
        for (let i = 0; i < this.packAssociationList.length; i++) {
          const assoc = this.packAssociationList[i];
          if (i === 0) {
            this.packImage = assoc.pack.packImage;
            const selectedVol = this.listVol.find(v => v.idVol === assoc.pack.vol.idVol);
            this.addPackForm = this._formBuilder.group({
              //only for the first element of the list get the pack details
              pack: this._formBuilder.group({
                id: [assoc.pack.id],
                packName: [assoc.pack.packName],
                packDescription: [assoc.pack.packDescription],
                packType: [assoc.pack.packType],
                packImage: [assoc.pack.packImage],
                vol: [this.listVol.find(v => v.idVol == assoc.pack.vol.idVol)]
              }),
              //create select for the destination and make its value assoc.destination.id
              //and for the destination create a multi select dropdown and set its values to assoc.activities.id with a for loop
              destinationGroups: this._formBuilder.array([]),

            })

          }

          const group = this._formBuilder.group({
            destinationId: [this.listDestination.find(d => d.id === assoc.destination.id), Validators.required],
            activityIds: [
              assoc.activities.map(a => assoc.activities.find(activity => activity.id === a.id)),
              Validators.required
            ],
            listActivity: [assoc.activities], // Store activities options for this group
            id: assoc.id
          });
          console.log("assoc=", assoc);
          this.destinationGroups.push(group);
        }
      },
      error: (err) => console.error('Error fetching pack:', err),
    })
  }

  get destinationGroups(): FormArray {
    return this.addPackForm.get('destinationGroups') as FormArray;
  }

  get destinations() {
    return this.addPackForm.get('destinations') as FormArray;
  }

  get activityIds() {
    return this.addPackForm.get('activityIds') as FormArray
  }

  onDestinationChange(event: any, index: number): void {

    var [selectedIndex, selectedId] = event.target.value.split(':');
    if (this.isEditMode) {
      const destinationAtIndex = this.listDestination[selectedIndex];
      selectedId = destinationAtIndex?.id;
    }



    console.log(selectedId);

    this._activityService.findByDestination(selectedId).subscribe({
      next: (res) => {
        const group = this.destinationGroups.at(index);
        group.patchValue({ activityIds: [] }); // Reset selected activities
        group.get('listActivity')?.setValue(res); // Save activity options for UI
      },
      error: (err) => console.error('Error fetching activities:', err),
    });
  }


  addDestination(assoc?: PackAssociation) {
    const group = this._formBuilder.group({
      destinationId: [null, Validators.required],
      activityIds: [[], Validators.required],
      listActivity: [[]], // Store activities options for this group
    });

    this.destinationGroups.push(group);
    this.showAddButton = false;
  }

  // Remove a destination group at the specified index
  removeDestinationGroup(index: number): void {
    this.destinationGroups.removeAt(index);
    console.log(index);
  }


  submitForm() {

    this.addPackForm.get('packImage')?.setValue(this.file);
    console.log(this.addPackForm.value);
    var pack = this.addPackForm.value.pack;
    console.log("paaaaack from form==",this.addPackForm.value.pack);
    if (this.file) {
      pack.packImage = this.file.name;
    }

    const destinationGroups = this.addPackForm.value.destinationGroups;
    if (!this.isEditMode) {
      const result = destinationGroups.map((group: any, index: number) => {
        const base: any = {
          destinationId: group.destinationId,
          activityIds: group.activityIds
        };

        // Add the pack to the first item only
        if (index === 0) {
          base.pack = pack;
        }

        return base;
      });

      console.log("result==", result);

      this._packService.save(result).subscribe({
        next: (res) => {
          console.log("pack submitted successfully");
          this._router.navigate(['/back-office/packs/pack/getAll']);
        }
      })
    }
    else {
      console.log("destination groups==",destinationGroups);
      console.log("paaack==",pack);
      const result = destinationGroups.map((group: any, index: number) => {
        const base: any = {
          id: group.id,
          destination: group.destinationId,
          activities: group.activityIds,
          pack: pack
        };
        return base;
      });

      console.log(this.addPackForm.value.pack.id);
      console.log("resultUpdate==", result);
      console.log("resultUpdate==", JSON.stringify(result));
      this._packService.update(this.addPackForm.value.pack.id, result).subscribe({
        next: (res) => {
          console.log(res);
          this._router.navigate(['/back-office/packs/pack/get', pack.id])
        }
      });

    }



  }

}
