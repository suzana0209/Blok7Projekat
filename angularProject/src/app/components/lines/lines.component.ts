import { Component, OnInit, NgZone } from '@angular/core';
import { Polyline } from '../map/modelsForMap/polyline';
import { MarkerInfo } from '../map/modelsForMap/marker-info.model';
import { StationModel } from 'src/app/models/station.model';
import { MapsAPILoader } from '@agm/core';
import { StationService } from 'src/app/services/stationService/station.service';
import { GeoLocation } from '../map/modelsForMap/geolocation';
import { LineService } from 'src/app/services/lineService/line.service';
import { LineModel } from 'src/app/models/line.model';
import { NgForm } from '@angular/forms';
import { IconSequence } from '@agm/core/services/google-maps-types';
import { LineStationModel } from 'src/app/models/lineStation.model';
import { LineStationService } from 'src/app/services/lineStationService/line-station.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { PomLineModel } from 'src/app/models/pomLineModel.model';
import { ValidForLineModel, ValidForEditLineModel } from 'src/app/models/modelsForValidation/validForLineModel.model';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css'],
  styles: ['agm-map {height: 400px; width: 100%;}']
})
export class LinesComponent implements OnInit {
  listOfColors: any = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];



  selectedForComboBox: string = '';
  selected: string = "";
  public polyline: Polyline;
  id: number;
  public zoom: number;
  stations: any = [];
  markerInfo: MarkerInfo;
  pomStat: StationModel;
  selectedStations: StationModel[] = [];
  lines: any = [];

  linesForEdit: any = []

  selectedLine: LineModel

  selectedForEdit: string = ''

  selectedLineForEdit: LineModel
  otherStations: any = [];

  lineStations: LineStationModel[] = []
  lineStation: LineStationModel

  counterForStation: number = 0
  orderedStation: any = [];
  linesWithOrderedStations: any = [];
  
  pomLine: any;

  keys: any = [];
  pomModelList: any = [];
  pomOdPom: PomLineModel;

  linesForComboBox: any = []

  lineForEditString: string = ''
  sLineForEdit: LineModel
  allLinesForEditFromDb: any = []
  orderedStationEdit: any = []

  newLineEdit: any;

  allStationFromDb: any = []

  restStation: any = []

  showComboBoxForAddSt: boolean = false;
  showComboBoxForAddSt2: boolean = false;


  arrayIntForAddStation: any = []
  showAddButtonBool: boolean = false;
  addStation: StationModel;
  addStationPosition: number;
  idAdded: number;

  validationsForAdd: ValidForLineModel = new ValidForLineModel();
  validationsForEdit: ValidForEditLineModel = new ValidForEditLineModel();
  showListOfStations: boolean = false;

  boolBezvezeZaPoruku: boolean = false;
  boolBezvezeZaPorukuDenied: boolean = false;
  userPom: any;
  sakrijDugmice: boolean = true;
  

  iconUrl: any = {url: "assets/busicon.png", scaledSize: {width: 50, height:50}}

  constructor(private ngZone: NgZone, private mapsApiLoader : MapsAPILoader , 
    private stationService: StationService, 
    private lineService: LineService, 
    private lineStationService: LineStationService, private userService: UsersService) { 

      this.sakrijDugmice = true;
      this.userService.getUserData(localStorage.getItem('name')).subscribe(a=>{
        console.log("Userrr: ", a);
        if(a != null && a != undefined){
          
          this.userPom = a;
          this.boolBezvezeZaPoruku = this.userPom.Activated;
          this.boolBezvezeZaPorukuDenied = this.userPom.Deny; 
        }
        
      })

    this.stationService.getAllStations().subscribe(data => {
      this.stations = data;
      this.allStationFromDb = data
      console.log(this.stations)
    });

    this.stationService.getAll().subscribe(k=>{
      //this.lines = k;   
      this.pomModelList = k;     

    });

    

    this.stationService.getIdes().subscribe(ides => {
      this.keys = ides;
    });


      this.lineService.getAllLines().subscribe(s => {
        this.linesForComboBox = s;
        this.allLinesForEditFromDb = s;
      })

      this.arrayIntForAddStation = [];
      
  }

  ngOnInit() {
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954), 
    "assets/ftn.png",
    "Jugodrvo" , "" , "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
    this.polyline = new Polyline([], 'blue', { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}});

  }

  stationClick(id: number){
    this.stations.forEach(element => {
      if(element.Id == id){
        this.pomStat = element;
      }
    });
    console.log(this.pomStat);
    this.selectedStations.push(this.pomStat);
  
    
    this.polyline.addLocation(new GeoLocation(this.pomStat.Latitude, this.pomStat.Longitude));
    this.id = id;

  }

  onSubmit(lineData: LineModel, form: NgForm){
    lineData.ListOfStations = this.selectedStations;

    if(this.validationsForAdd.validate(lineData)){
      return;
    }

    this.lineService.AlredyExistRegularNumber(lineData).subscribe(a=>{
      if(a == "Yes"){
        alert("Line number: "+ lineData.RegularNumber +" alredy exists!");
        //window.location.reload();
      }
      else if(a == "No"){
        console.log(lineData);
        this.lineService.addLine(lineData).subscribe(data => {
        alert("Line "+ lineData.RegularNumber +" successful added!");
        window.location.reload();
        

      },
      err => {
        //alert("Add line - error - already exist!");
        window.alert(err.error);

        window.location.reload();
        
        })
      }
    })

  }

  onSubmitDelete(lineData: LineModel, form:NgForm){
    console.log("Line for delete: ", lineData);

    if(this.validationsForAdd.validateForDelete(lineData)){
      return;
    }
    
      this.lineService.deleteLine(this.selectedLine.Id).subscribe(data => {
        alert("Line with Number="+ lineData.RegularNumber +" successful delted!");
        form.reset();
        window.location.reload();
  
      },
      err => {
        //alert("Delete line - error!");
        window.alert(err.error);
        window.location.reload();
  
        //console.log(lineData);
      })
  }


  onSubmitEdit(){

    console.log("Nove linije za edit:", this.newLineEdit);
    console.log("pozicja: ", this.addStationPosition);
    
    this.lineService.editLine(this.newLineEdit.Id, this.newLineEdit).subscribe(d=>{
      alert("Line with ID="+ this.newLineEdit.Id +" successful changed!")

      window.location.reload();
    },
    err=>{
      window.alert(err.error);
      window.location.reload();
    })

  }


  // poziva se u delete-u  
  showLines(event: any){
    this.selectedForComboBox = event.target.value;

    this.linesForComboBox.forEach(element => {
      if(element.RegularNumber == this.selectedForComboBox){
        this.selectedLine = element;     
      }
    });

     if(this.selectedLine != null){
       this.stationService.getOrderedStations(this.selectedLine.Id).subscribe(d =>{
         this.orderedStation = d;
         
         console.log(d);
       });
      }
  }

  showLinesForChange(event: any){
    //this.showComboBoxForAddSt = true;
    this.lineForEditString = event.target.value;
    if(this.lineForEditString != null && this.lineForEditString != undefined){
      this.showListOfStations = true;
    }
    this.allLinesForEditFromDb.forEach(element => {
      if(element.RegularNumber == this.lineForEditString){
        this.sLineForEdit = element;

      }
    });

    if(this.sLineForEdit != null){
      this.stationService.getOrderedStations(this.sLineForEdit.Id).subscribe(d =>{
        this.orderedStationEdit = d;
        
        this.newLineEdit = this.sLineForEdit;
        this.newLineEdit.ListOfStations = this.orderedStationEdit;
        console.log("New line",this.newLineEdit);

        this.restStation = this.allStationFromDb.filter(o=> !this.newLineEdit.ListOfStations.find(o2=> o.Id === o2.Id));
        
        let countOfArray1 = this.newLineEdit.ListOfStations.length;

      if(this.arrayIntForAddStation.length <= countOfArray1){
        for (let i = 0; i < countOfArray1 + 1; i++) {
          this.arrayIntForAddStation.push(i+1);
        }
      }
    });
      
     }
    
  }


  removeStationFromLine(id: number){
    var counter = 0;
    this.newLineEdit.ListOfStations.forEach(element => {      
      if(element.Id == id){
        this.newLineEdit.ListOfStations.splice(counter, 1);
        console.log("Izbrisana: ", this.newLineEdit);

        //moze da doda element samo ako vec ne postoji u rest-u
        if(this.alreadyExists(this.restStation, element.Id)){    
          this.restStation.push(element);
        }

        console.log("Probaj rest: ", this.restStation);
        if(this.arrayIntForAddStation.length > 0){       
          this.arrayIntForAddStation.pop();
        }
      }
      counter++;
    });
  }

  sendIdOfStation(event){
    console.log("Target vale", event.target.value);
    if(event.target.value != ""){
      this.showComboBoxForAddSt2 = true;
      
      this.idAdded = parseInt(event.target.value, 10)
      this.restStation.forEach(element => {
        if(element.Id == this.idAdded){
          //this.restStation.splice(this.idAdded, 1);
          
        }
      });
      
      
    }
  }

  finallyAdd(){
    //validacija za stanicu i poziciju
    if(this.validationsForEdit.validate(this.idAdded, this.addStationPosition)){
      return;
    }

    console.log("Prije dodaavanja", this.newLineEdit);
      this.restStation.forEach(ee => {
        if(ee.Id == this.idAdded ){
          if(this.alreadyExists(this.newLineEdit.ListOfStations, this.idAdded)){
            this.newLineEdit.ListOfStations.splice(this.addStationPosition-1, 0, ee);
                   
          }
          
        }
      });

      let counterForDel = 0;

      this.restStation.forEach(e1 => {
        if(e1.Id == this.idAdded){
          this.restStation.splice(counterForDel, 1);
        }
        counterForDel = counterForDel + 1;
      });

      if(this.idAdded != 0){
        this.arrayIntForAddStation.push(this.arrayIntForAddStation.length+1);
      }
      
      this.showAddButtonBool = false;
      this.showComboBoxForAddSt =  false;
      this.showComboBoxForAddSt2 = false;

  }

  alreadyExists(list: StationModel[], id: number): boolean{
    list.forEach(d=>{
      if(d.Id == id){
        return false;
      }
    })
    return true;
  }

  showAddButton(event){
    if(event.target.value != "" && parseInt(event.target.value, 10) > 0){
      this.showAddButtonBool = true;
      this.addStationPosition = parseInt(event.target.value, 10)      
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


  showComboBox(){
    this.showComboBoxForAddSt = true;
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

  isTrue(name:string):boolean{
    if(this.selectedLineForEdit != null){
      this.selectedLineForEdit.ListOfStations.forEach(element => {
        if(element.Name == name){
          element.Checked = true;
          return true;
        }
      });
    }
    return false;
  }

  refresh(){
   window.location.reload();
  }

}
