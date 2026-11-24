import { Component } from '@angular/core';
import { FlightHelperService } from 'src/app/front-office/helper/flight/flight-helper.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent extends FlightHelperService {

}
