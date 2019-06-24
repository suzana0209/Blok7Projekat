import { Component, OnInit } from '@angular/core';
import { LineService } from 'src/app/services/lineService/line.service';
import { TimetableModel, TimetableModel2, TimetableModel3, TimetableModel4 } from 'src/app/models/timetable.model';
import { NgForm } from '@angular/forms';
import { TimetableService } from 'src/app/services/timetableService/timetable.service';
import { parse } from 'querystring';
import { element } from 'protractor';
import { DayService } from 'src/app/services/dayService/day.service';
import { Router } from '@angular/router';
import { ValidTimetableModel } from 'src/app/models/validTimetable.model';
import { ValidForTimetableModel, ValidForTimetableDeleteModel, ValidForTimetableEditModel } from 'src/app/models/modelsForValidation/validForTimetable.model';

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
   showDepForUnregisterUser: boolean = false;
   messageDontDepartures: string = ""

   validations: ValidTimetableModel = new ValidTimetableModel();
   validationsForAdd: ValidForTimetableModel = new ValidForTimetableModel();
   validationsForDelete: ValidForTimetableDeleteModel = new ValidForTimetableDeleteModel();
   validationsForEdit :ValidForTimetableEditModel = new ValidForTimetableEditModel();


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

    this.clickedDeleteTime = false;
    
  }

  ngOnInit() {
  }

  onSubmit(timetableData: TimetableModel, form:NgForm){
      console.log("TimeTable:", timetableData);
      

      var kk: string = "";
      kk = timetableData.Departures.toString()
      var tt = new TimetableModel2(timetableData.LineId, timetableData.DayId, kk);
      console.log(tt);

      if(this.validationsForAdd.validate(tt)){
        return;
      }

      this.timetableService.AlredyExistTimetable(tt).subscribe(a=>{
        console.log(a);
        if(a == "No"){
          this.timetableService.addTimeTable(tt).subscribe(rez=>{
            alert("Timetable successful added!");
            window.location.reload();
          })
        }
        else if(a == "Yes"){
          alert("Timetable aleredy exists!");
          window.location.reload();
        }
      })

      // this.timetableService.addTimeTable(tt).subscribe();   
      
  }

  onSubmitDelete(timetableData: TimetableModel3, form:NgForm){
    console.log("TimeTableForDelete:", timetableData);

    if(this.validationsForDelete.validate(timetableData)){
      return;
    }
    
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
      alert("Timetable delete successful!");
      window.location.reload();
    },
    error => {
      alert("Timetable delete - error Don't exist!");
      window.location.reload();
    });

  }

  onSubmitEdit(timetableData: TimetableModel4, form:NgForm){

    

    // if(this.clickedDeleteTime){
    //   timetableData.NewDepartures = timetableData.Departures;
    // }
    // else{
    //   if(this.validationsForEdit.validate(timetableData)){
    //     return;
    //   }
    // }
   
    let ttt = new TimetableModel4(this.lineId, this.dayId, this.departuresForEditInput, timetableData.NewDepartures);

    console.log("TTTTT", ttt);

    if(this.clickedDeleteTime){
      ttt.NewDepartures = ttt.Departures;
      this.timetableService.editTimetable(this.timetableIdForSend, ttt).subscribe(dd=>{
        alert("Departure successful delete!");
        window.location.reload();
        
      });
    }
    else{
      this.timetableService.AlreadyExistByEdit(ttt).subscribe(a=>{
        if(a == "No"){
          this.timetableService.editTimetable(this.timetableIdForSend, ttt).subscribe(dd=>{
            alert("Departure successful edit!");
            window.location.reload();
          });
        }
        else if(a == "Yes"){
          alert("New departure alredy exist in timetable!");
          window.location.reload();
        }
      });
    }
    

    // this.timetableService.editTimetable(this.timetableIdForSend, ttt).subscribe();
  }

 


  getLineForEdit(event){

    this.showDepartureComboBox = false;
    this.showDepForUnregisterUser = false;
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
    this.showDepForUnregisterUser = false;
    
    console.log("Targetttt", event.target.value);
    if(event.target.value != "" || event.target.value != null || event.target.value.length != 0){
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
    if(event.target.value.length != 0){
      this.boolForButton = true;
    }
    else{
      this.messageDontDepartures = "Don't departures for selected line!";
    }
    //this.boolForButton = true;
    this.departuresForEditInput = event.target.value;
    this.hiddenDeleteButton =true;
    this.hiddenEditButton = true;
  }

  editTime(){
    this.clickedDeleteTime = false;

    this.showInputTime = true;
    this.editSubmitBool = true;
    this.hiddenEditButton = false;

    this.hiddenDeleteButton = false;
  }

  deleteTime(){
    this.clickedDeleteTime = true;
    this.hiddenDeleteButton = false;

    this.editSubmitBool = true;
    this.hiddenEditButton = false;
  }
  
  getLineForEditUnloggedAdmin(event){
    this.selectedDayFromCb = event.target.value;
    if(this.selectedDayFromCb.length != 0){
      this.showLineCbForUnlogedUser = true;
    }
    console.log("Dayssss: ", this.selectedDayFromCb);
  }

  showDepartureOnClick(){
    // if(this.validations.validate(this.selectedDayForEdit, this.pom)){
    //   return;
    // }
    this.showDepForUnregisterUser = true;
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