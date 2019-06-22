import { Component, OnInit, NgZone} from '@angular/core';
import { MarkerInfo } from './modelsForMap/marker-info.model';
import { Polyline } from './modelsForMap/polyline';
import { GeoLocation } from './modelsForMap/geolocation';

// @Injectable({
//   providedIn: 'root'
// })
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  styles: ['agm-map {height: 500px; width: 700px;}'] //postavljamo sirinu i visinu mape
})
export class MapComponent implements OnInit {
  
  markerInfo: MarkerInfo;
  public polyline: Polyline;
  public zoom: number;

  constructor(private ngZone: NgZone){
  }

  ngOnInit() {
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954), 
      "assets/ftn.png",
      "Jugodrvo" , "" , "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");

      this.polyline = new Polyline([], 'blue', { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}});
  }

  placeMarker($event){
    this.polyline.addLocation(new GeoLocation($event.coords.lat, $event.coords.lng))
    console.log(this.polyline)
  }

  // placeMarker2(lat: number, lng: number, name:string, link: string ){
  //   //this.polyline.addLocation(new GeoLocation(lat, lng))
  //   this.markerInfo = new MarkerInfo(new GeoLocation(lat, lng),"assets/ftn.png",
  //    name, "", link);
  //   //console.log(this.polyline)
  // }

}
