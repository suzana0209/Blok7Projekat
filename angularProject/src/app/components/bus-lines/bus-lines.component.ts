import { Component, OnInit, NgZone } from '@angular/core';
import { MarkerInfo } from '../map/modelsForMap/marker-info.model';
import { GeoLocation } from '../map/modelsForMap/geolocation';
import { Polyline } from '../map/modelsForMap/polyline';
import { StationModel } from 'src/app/models/station.model';
import { StationService } from 'src/app/services/stationService/station.service';
import { LineService } from 'src/app/services/lineService/line.service';
import { PomLineModel } from 'src/app/models/pomLineModel.model';
import { element } from 'protractor';
import { R3TargetBinder } from '@angular/compiler';
import { PoModelForColors } from 'src/app/models/poModelForColors.model';

@Component({
  selector: 'app-bus-lines',
  templateUrl: './bus-lines.component.html',
  styleUrls: ['./bus-lines.component.css'],
  styles: ['agm-map {height: 500px; width: 700px;}']
})
export class BusLinesComponent implements OnInit {

  markerInfo: MarkerInfo;
  stations: any= []; //lista svihStranica
  lines: any = [];  //listaSvihLinija
  pomModel: any = []; //lista PomModela (idLinije, ListaStanica po datom redosledu)
  listOfCheckedLines: any = [];
  idOfCheckedLines: number[] = [];
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
  listOfCheckedColors: PoModelForColors[] = [];
  counterForColor: number = 0;

  polyline: Polyline;
  pomStat: StationModel;
  selectedStations: StationModel[] = [];
  id: number;

  iconUrl: any = {url: "assets/busicon.png", scaledSize: {width: 50, height:50}}
  
  constructor(private ngZone: NgZone, 
    private stationService: StationService,
    private lineService: LineService) {
    this.stationService.getAllStations().subscribe(a => {
      this.stations = a;
    });

    this.lineService.getAllLines().subscribe(b => {
      this.lines = b;
    })

    this.stationService.getAll().subscribe(c =>{
      this.pomModel = c;
    });  

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

  ShowCheckedLine(event: any){
    let checkedBool = event.target.checked;
    let parse = parseInt(event.target.value, 10)
    console.log("Bool",checkedBool)
    console.log("Parse", parse);
    
    if(checkedBool){
      if(this.alreadyExistsId(this.idOfCheckedLines, parse)){        
          this.idOfCheckedLines.push(parse);
      }    
      
      console.log("Checked IDs",this.idOfCheckedLines)
      this.pomModel.forEach(element => {
        if(element.Id == parse){
          this.listOfCheckedLines.push(element);
        }
      });
      console.log("Dodavanje")
      console.log("ListOfCheckedLines: ",this.listOfCheckedLines);
      console.log("idOfCheckedLines", this.idOfCheckedLines);
    }
    else{
      let a: number;
      this.idOfCheckedLines.forEach(element => {
        //let counter1 = 0;
        if(element == parse){
          a = element;
            //this.idOfCheckedLines.splice(counter1, 1);
            //this.listOfCheckedLines.splice(counter1, 1);
            
        }


        //counter1++;
      });

      const index: number = this.idOfCheckedLines.indexOf(a);
      this.idOfCheckedLines.splice(index, 1);
      this.listOfCheckedLines.splice(index, 1);

      console.log("Brisanje")
      console.log("ListOfCheckedLines: ",this.listOfCheckedLines);
      console.log("idOfCheckedLines", this.idOfCheckedLines);

      // this.listOfCheckedLines.forEach(element =>{
      //   let counter = 0;
      //   if(element.Id == parse){
      //     this.listOfCheckedLines.splice(counter, 1);
      //   }
      //   counter++;
      // });
    }
  }

  alreadyExistsId(listId: number[], id:number): boolean{
    listId.forEach(element => {
      if(element == id){
        return false;
      }
    });
    return true;
  }

}
