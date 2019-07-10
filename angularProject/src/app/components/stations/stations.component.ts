import { Component, OnInit, NgZone } from '@angular/core';
import { GeoLocation } from '../map/modelsForMap/geolocation';
import { MarkerInfo } from '../map/modelsForMap/marker-info.model';
import { StationService } from 'src/app/services/stationService/station.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { StationModel } from 'src/app/models/station.model';
import { NgForm } from '@angular/forms';
import { MapComponent } from '../map/map.component';
import { Router } from '@angular/router';
import { ValidForAddStationModel } from 'src/app/models/modelsForValidation/validForStation.model';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css'],
  styles: ['agm-map {height: 400px; width: 100%;}']
  //styles: ['agm-map {height: 500px; width: 700px;}']
  //styles: ['agm-map {height: 500px; width: 80%;}']
})
export class StationsComponent implements OnInit {
  private selected: string = '';
  coordinates: GeoLocation = new GeoLocation(0,0); 
  markerInfo: MarkerInfo;
  private geocoder : any;


  address: string;

  public stations: any = [];
  markers: any = [];
  iconUrl: any = {url: "assets/busicon.png", scaledSize: {width: 50, height:50}}

  newStation: StationModel
  public nameOfStation: string = "";
  id: number;
  version: number;

  validationsForAdd: ValidForAddStationModel = new ValidForAddStationModel();
  boolBezvezeZaPoruku: boolean = false;
  boolBezvezeZaPorukuDenied: boolean = false;
  userPom: any;
  sakrijDugmice: boolean = true;




  constructor(private ngZone: NgZone, private route: Router, private mapsApiLoader: MapsAPILoader,
    private stationService: StationService, private userService: UsersService) {
    this.sakrijDugmice = true;
    this.userService.getUserData(localStorage.getItem('name')).subscribe(a=>{
      console.log("Userrr: ", a);
      if(a != null && a != undefined){
        
        this.userPom = a;
        this.boolBezvezeZaPoruku = this.userPom.Activated;
        this.boolBezvezeZaPorukuDenied = this.userPom.Deny;
      }
      
    })
    
    this.stationService.getAllStations().subscribe(st =>{
      this.stations = st;
    });
  }

  ngOnInit() {
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954), 
    "assets/ftn.png",
    "Jugodrvo" , "" , "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
  
    this.mapsApiLoader.load().then(() =>{
      this.geocoder = new google.maps.Geocoder();
    });

  }

  onSubmit(stationData: StationModel, form: NgForm){

    stationData.Latitude = this.coordinates.latitude;
    stationData.Longitude = this.coordinates.longitude;
    stationData.AddressStation = this.address;

    console.log(stationData);

    if(this.validationsForAdd.validate(stationData)){
      return;
    }

    this.stationService.AlredyExistStation(stationData).subscribe(a=>{
      if(a == "Yes"){
        alert("Station name "+ stationData.Name +" already exists! ");
        //window.location.reload();
      }
      else if (a == "No"){
        this.stationService.AlredyExistsStationForEdit(stationData).subscribe(a2=>{
          if(a2 == "Yes"){
            alert("On address: "+ stationData.AddressStation +" alredy exists station!");
            //window.location.reload();
          }
          else{
            this.stationService.addStation(stationData).subscribe(data => {
              alert("Station: " +stationData.Name+ " is successfully added!");
              
              window.location.reload();
            },
            err => {
              //alert("Station - error!");
              window.alert(err.error);
              //window.refresh();
              window.location.reload();
        
            });
          }
        })
        
      }
    })

  }

  onSubmitEdit(stationData: StationModel, form: NgForm){

    stationData.Latitude = this.coordinates.latitude;
    stationData.Longitude = this.coordinates.longitude;
    stationData.AddressStation = this.address;
    stationData.Name = this.nameOfStation;
    stationData.Id = this.id;
    stationData.Version = this.version;

    console.log(stationData);

    if(this.validationsForAdd.validate(stationData)){
      return;
    }

    this.stationService.AlredyExistsStationForEdit(stationData).subscribe(aa=>{
      if(aa == "Yes"){
        alert("On address: "+ stationData.AddressStation +" alredy exists station!");
        //window.location.reload();
        
      }
      else if(aa == "No"){
        this.stationService.editStation(stationData).subscribe(data => {
          alert("Station with Name="+ stationData.Name +" changed successfully!");
          //this.route.navigate(['/station']);
          window.location.reload();
        },
        err => {
          //alert("Station changed - error!");
          window.alert(err.error);
          
          window.location.reload();
        });
      }
    })
      
  }

  onSubmitDelete(stationData: StationModel, form:NgForm){

    console.log("Stanicaaa: ", stationData);

    if(this.id == null || this.id == undefined){
      alert("please select the station that you want to delete!");
      
      window.location.reload();
    }
    else{
      this.stationService.deleteStation(this.id).subscribe(x => {
        alert("Station with ID="+ this.id +" is successful deleted! ")
        window.location.reload();
      },
      err=>{
        window.alert(err.error);
        
        window.location.reload();
      });
    }
    
  }

  LoggedAdmin(): boolean{
    if(localStorage.getItem('role') == "Admin" && this.boolBezvezeZaPoruku && !this.boolBezvezeZaPorukuDenied){
      return true;
    }
    return false;
  }

  NonActiveAdmin(){
    if(localStorage.getItem('role') == "Admin" && !this.boolBezvezeZaPoruku && !this.boolBezvezeZaPorukuDenied){
      return true;
    }
    return false;
  }

  DeniedAdmin(){
    if(localStorage.getItem('role') == "Admin" && this.boolBezvezeZaPorukuDenied){
      return true;
    }
  }

  markerDragEnd($event: MouseEvent, nameOfStation:string, id: number, version:number) {
    console.log($event);
     this.coordinates.latitude = $event.coords.lat;
     this.coordinates.longitude = $event.coords.lng;
     this.getAddress(this.coordinates.latitude, this.coordinates.longitude);
     this.nameOfStation = nameOfStation;
     this.id = id;
     this.version = version;
     console.log(id);
  }

  stationClick(id: number){
    this.id = id;
  }

  placeMarker1($event){
    this.coordinates = new GeoLocation($event.coords.lat, $event.coords.lng);
    this.getAddress(this.coordinates.latitude,this.coordinates.longitude);
  }


  getAddress(latitude: number,longitude:number){
    this.geocoder.geocode({'location': {lat: latitude, lng: longitude}}, (results,status) =>{
      console.log(results);
      if(status === 'OK'){
          if(results[0]){
            this.address = results[0].formatted_address;
          }
          else{
            window.alert('no results found');
          }
      }
    });

  }

  showAdd(){
    this.sakrijDugmice = false;
    this.selected = "Add";
    
  }

  showEdit(){
    
    this.sakrijDugmice = false;
    this.selected = "Edit";
  }

  showDelete(){
    
    this.sakrijDugmice = false;
    this.selected = "Delete";
  }

  isSelectedAdd(): boolean{
    if(this.selected == 'Add'){
      return true;
    }
  }

  isSelectedEdit(): boolean{
    if(this.selected == 'Edit'){
      return true;
    }
  }

  isSelectedDelete(): boolean{
    if(this.selected == 'Delete'){
      return true;
    }
  }
}
