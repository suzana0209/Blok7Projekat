import { Component, OnInit } from '@angular/core';
import { LineService } from 'src/app/services/lineService/line.service';
import { TimetableModel, TimetableModel2, TimetableModel3, TimetableModel4 } from 'src/app/models/timetable.model';
import { NgForm } from '@angular/forms';
import { TimetableService } from 'src/app/services/timetableService/timetable.service';
import { parse } from 'querystring';
import { element } from 'protractor';
import { DayService } from 'src/app/services/dayService/day.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {

  selected: string = "";
  allLinesFromDb: any = []
  allTimetablesFromDb: any = [];
  allDaysFromDb: any = []
  //tt: TimetableModel2;

  dayId: number = 0;
  lineId: number = 0;
  timetableId: number = 0;

  allLinesFromTimetable: any = [];

  allLT: any = [];
  comboBoxLineForEdit: any = []
  comboBoxDayForEdit: any = []

  selectedDayForEdit: any;

  allLineForSelDay: any = []

  allLineForSelectedDays: any = []

  idLinesArray: any[] = []
  showLineComboBox: boolean = false;
  showDepartureComboBox: boolean = false;

  allDeparturesForSelect: string[] = []

  departuresForEditInput: string = ""
  showInputTime: boolean = false;

  timetableIdForSend: number = 0

  clickedDeleteTime: boolean = false;
  boolForButton: boolean = false;
  editSubmitBool: boolean = false;

  hiddenDeleteButton: boolean = false;
  hiddenEditButton: boolean = false;

   selectedDayFromCb: string = "";
   selectedLineFromCb: string = ""

   showLineCbForUnlogedUser: boolean = false;
   izabranaLinija: string = "";

   pom: string = ""
   polasci: any = []


  constructor(private lineService: LineService, 
              private timetableService: TimetableService, private daysService: DayService, private router:Router) { 
    this.lineService.getAllLines().subscribe(d=>{
      this.allLinesFromDb = d;
    });

    this.timetableService.getAll().subscribe(e =>{
      this.allTimetablesFromDb = e; 
      console.log("TT",this.allTimetablesFromDb);
    })

    this.daysService.getAll().subscribe(d1=>{
        this.allDaysFromDb = d1
        console.log(d1);
    }) 
  }

  ngOnInit() {
  }

  onSubmit(timetableData: TimetableModel, form:NgForm){
      console.log("TimeTable:", timetableData);
      
      var kk: string = "";
      kk = timetableData.Departures.toString()
      var tt = new TimetableModel2(timetableData.LineId, timetableData.DayId, kk);
      console.log(tt);
      this.timetableService.addTimeTable(tt).subscribe();   
      
  }

  onSubmitDelete(timetableData: TimetableModel3, form:NgForm){
    console.log("TimeTableForDelete:", timetableData);

    
    this.allDaysFromDb.forEach(d => {
      if(d.Name == timetableData.DayId){
        this.dayId = d.Id;
      }
    });


    this.allLinesFromDb.forEach(l => {
      if(l.RegularNumber == timetableData.LineId){
        this.lineId = l.Id;
        
      }
    });


    this.allTimetablesFromDb.forEach(element => {
        if(element.LineId == this.lineId && element.DayId == this.dayId){
            this.timetableId = element.Id;
        }
    });

    this.timetableService.deleteTimetable(this.timetableId).subscribe(data => {
      alert("Timetable delete successfull!");
    },
    error => {
      alert("Timetable delete - error Don't exist!");
    });

  }

  onSubmitEdit(timetableData: TimetableModel4, form:NgForm){
    if(this.clickedDeleteTime){
      timetableData.NewDepartures = timetableData.Departures;
    }
   
    let ttt = new TimetableModel4(this.lineId, this.dayId, this.departuresForEditInput, timetableData.NewDepartures);

    console.log("TTTTT", ttt);

    this.timetableService.editTimetable(this.timetableIdForSend, ttt).subscribe();
  }

 


  getLineForEdit(event){
    if(event.target.value != "" || event.target.value != null){
      this.showLineCbForUnlogedUser = true;

      this.showLineComboBox = true;
      this.allLineForSelDay = []
      this.idLinesArray = []
  
      this.selectedDayForEdit = event.target.value;
      console.log("Selected day: ", this.selectedDayForEdit)
  
      this.allDaysFromDb.forEach(element => {
        if(element.Name == this.selectedDayForEdit){
          this.dayId = element.Id;
        }
      });
  
      this.allTimetablesFromDb.forEach(element => {
        if(element.DayId == this.dayId){ 
          this.idLinesArray.push(element.LineId);
        }
      });
  
      this.idLinesArray.forEach(d=>{
        this.allLinesFromDb.forEach(e => {
          if(d == e.Id){
            if(!this.allLineForSelDay.includes(e.RegularNumber)){
              this.allLineForSelDay.push(e.RegularNumber);
            } 
          }
        });
      })
    }
    

  }

  getDeparturesForEditt(event){
    this.allDeparturesForSelect = []
    console.log("Targetttt", event.target.value);
    if(event.target.value != "" || event.target.value != null){
      this.showDepartureComboBox = true;
      this.pom = event.target.value;
     this.allLinesFromDb.forEach(element => {
       if(element.RegularNumber == event.target.value){
         this.lineId = element.Id;
       }
     });

     this.allTimetablesFromDb.forEach(e1 => {
       if(e1.DayId == this.dayId && e1.LineId == this.lineId){
         this.allDeparturesForSelect = e1.Departures.split("|");
         this.timetableIdForSend = e1.Id;
       }
     });
     this.polasci = this.allDeparturesForSelect;
     this.allDeparturesForSelect.pop();
     console.log("Departures: ", this.allDeparturesForSelect)
    }
  }

  setNewDepartures(event){
    //this.showInputTime = true;
    this.boolForButton = true;
    this.departuresForEditInput = event.target.value;
    this.hiddenDeleteButton =true;
    this.hiddenEditButton = true;
  }

  editTime(){
    this.showInputTime = true;
    this.editSubmitBool = true;
    this.hiddenEditButton = false;
  }

  deleteTime(){
    this.clickedDeleteTime = true;
    this.hiddenDeleteButton = false;
  }
  
  getLineForEditUnloggedAdmin(event){
    this.selectedDayFromCb = event.target.value;
    if(this.selectedDayFromCb.length != 0){
      this.showLineCbForUnlogedUser = true;
    }
    console.log("Dayssss: ", this.selectedDayFromCb);
  }


//click
showTimetableForUser(){
  console.log()
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

  showTimeT(){
    this.selected = "Show"
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

  isSelectedShow(): boolean{
    if(this.selected == 'Show'){
      return true;
    }
  }

  LoggedAdmin(): boolean{
    if(localStorage.getItem('role') == "Admin"){
      return true;
    }
    return false;
  }  

}