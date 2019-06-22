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

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css'],
  styles: ['agm-map {height: 500px; width: 700px;}']
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
  

  iconUrl: any = {url: "assets/busicon.png", scaledSize: {width: 50, height:50}}

  constructor(private ngZone: NgZone, private mapsApiLoader : MapsAPILoader , 
    private stationService: StationService, 
    private lineService: LineService, 
    private lineStationService: LineStationService) { 
    this.stationService.getAllStations().subscribe(data => {
      this.stations = data;
      this.allStationFromDb = data
      console.log(this.stations)
    });

    this.stationService.getAll().subscribe(k=>{
      //this.lines = k;
      //console.log("Lineeeee: ", this.lines);    
      this.pomModelList = k;  
      console.log("LineeeeepomModelList: ", this.pomModelList);    

    });

    //if(this.lines.length != 0){
      
   // }

    this.stationService.getIdes().subscribe(ides => {
      this.keys = ides;
      console.log("Keysssss: ", this.keys);
    });

    // this.keys.forEach(element => {
    //   console.log("cc", this.lines[element]);

    //   var p = new PomLineModel(element,this.lines[element]);
    //   this.pomModelList.push(p);
    // });    
      
      // this.lineStation = new LineStationModel(-1,-1,-1)

      this.lineService.getAllLines().subscribe(s => {
        this.linesForComboBox = s;
        this.allLinesForEditFromDb = s;
        console.log("Linije iz baze: ", this.linesForComboBox)
      })

      this.arrayIntForAddStation = []
      
  }

  ngOnInit() {
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954), 
    "assets/ftn.png",
    "Jugodrvo" , "" , "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
    this.polyline = new Polyline([], 'blue', { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}});
    // this.keys = Object.keys(this.lines);
    // console.log("keys", this.keys);


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

    console.log(lineData);
    this.lineService.addLine(lineData).subscribe(data => {
      alert("Add line successfull!");
      window.location.reload();

    },
    error => {
      alert("Add line - error - already exist!");
      console.log(lineData);
    })

    // this.lineStationService.addLine(lineData).subscribe(data => {
    //   alert("Add lineStation successfull!");
    // },
    // error => {
    //   alert("Add line - error - already exist!");
    // })
  }

  onSubmitDelete(lineData: LineModel, form:NgForm){
    this.lineService.deleteLine(this.selectedLine.Id).subscribe(data => {
      alert("Delete line successfull!");
      window.location.reload();

    },
    error => {
      alert("Delete line - error!");
      console.log(lineData);
    })
  }

  // onSubmitEdit(lineData: LineModel, form:NgForm){
  //     console.log("Nove linije za edit:", this.newLineEdit);
  //     console.log("pozicja: ", this.addStationPosition);

  //     this.lineService.editLine(this.newLineEdit.Id, this.newLineEdit).subscribe(d=>{
  //       alert("Usp")
  //     })

  //   }

  onSubmitEdit(){
    console.log("Nove linije za edit:", this.newLineEdit);
    console.log("pozicja: ", this.addStationPosition);

    this.lineService.editLine(this.newLineEdit.Id, this.newLineEdit).subscribe(d=>{
      alert("Seccesfully changed line")
      window.location.reload();

    })

  }


  // poziva se u delete-u  
  showLines(event: any){
    this.selectedForComboBox = event.target.value;

    this.linesForComboBox.forEach(element => {
      if(element.RegularNumber == this.selectedForComboBox){
        this.selectedLine = element;     

        // this.linesForEdit.a
        // this.polyline.addLocation(new GeoLocation(element.ListOfStations.Latitude, element.ListOfStations.Longitude));
        
      }
    });

     if(this.selectedLine != null){
       this.stationService.getOrderedStations(this.selectedLine.Id).subscribe(d =>{
         this.orderedStation = d;
         console.log("oS");
         console.log(d);
       });
      }
  }

  showLinesForChange(event: any){
    //this.showComboBoxForAddSt = true;
    this.lineForEditString = event.target.value;
    this.allLinesForEditFromDb.forEach(element => {
      if(element.RegularNumber == this.lineForEditString){
        this.sLineForEdit = element;

      }
    });

    if(this.sLineForEdit != null){
      this.stationService.getOrderedStations(this.sLineForEdit.Id).subscribe(d =>{
        this.orderedStationEdit = d;
        //console.log("Allll line for change");
        this.newLineEdit = this.sLineForEdit;
        this.newLineEdit.ListOfStations = this.orderedStationEdit;
        console.log("New line",this.newLineEdit);

        this.restStation = this.allStationFromDb.filter(o=> !this.newLineEdit.ListOfStations.find(o2=> o.Id === o2.Id));
        console.log("Rest: ", this.restStation);

      console.log("D", d);

      let countOfArray1 = this.newLineEdit.ListOfStations.length

      console.log("Broj elemenata: ", countOfArray1);

      if(this.arrayIntForAddStation.length <= countOfArray1){
        for (let i = 0; i < countOfArray1 + 1; i++) {
          this.arrayIntForAddStation.push(i+1);
        }
      }
    });
      
     }

     

    // console.log("Selected line for edit", this.selectedLineForEdit)
    
    // console.log(this.selectedLineForEdit);   
    // this.otherStations = this.stations.filter(o=> !this.selectedLineForEdit.ListOfStations.find(o2=> o.Id === o2.Id));

    // console.log("Other stations: ", this.otherStations);
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

  // finallyAdd(){
  //   console.log("Prije dodaavanja", this.newLineEdit);
  //     this.restStation.forEach(ee => {
  //       if(ee.Id == this.idAdded ){
  //         this.newLineEdit.ListOfStations.splice(this.addStationPosition-1, 0, ee);
  //         console.log("New line added =>:", this.newLineEdit);
  //       }
  //     });
  //     this.arrayIntForAddStation.push(this.arrayIntForAddStation.length+1);
      
  //     this.showAddButtonBool = false;
  //     this.showComboBoxForAddSt =  false;
  //     this.showComboBoxForAddSt2 = false;

  // }

  finallyAdd(){
    console.log("Prije dodaavanja", this.newLineEdit);
      this.restStation.forEach(ee => {
        if(ee.Id == this.idAdded ){
          if(this.alreadyExists(this.newLineEdit.ListOfStations, this.idAdded)){
            this.newLineEdit.ListOfStations.splice(this.addStationPosition-1, 0, ee);
            console.log("New line added =>:", this.newLineEdit);         
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

      //this.restStation.splice(this.idAdded, 1);

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

  showComboBox(){
    this.showComboBoxForAddSt = true;
  }
  

  showAdd(){
    this.selected = "Add";
  }

  showEdit(){
    this.selected = "Edit";
  }

  showDelete(){
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
}
