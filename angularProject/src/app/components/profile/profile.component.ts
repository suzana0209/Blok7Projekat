import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { RegistrationModel } from 'src/app/models/registration.model';
import { PomAppUserModel } from 'src/app/models/pomAppUser.model';
import { NgForm } from '@angular/forms';
import { PomModelForPassword } from 'src/app/models/PomModelForPassword.model';
import { Router } from '@angular/router';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UsersService]
})

export class ProfileComponent implements OnInit {
  selected: string = "";
  user: any;
  userForEdit: PomAppUserModel;
  pp = new PomModelForAuthorization("");

  studentOrPensioner = false;

  ClickedButtonEdit: boolean = false;
  addressFromDb: any = []

  idAdressFromDb: number;
  dateForEdit: any = []

  modell: any;

  showImageBool: boolean = false;
  selectedImage: any;

  showApplyButton: boolean = false;

  wtfList: any;
  imagesLoaded: boolean = false;
  userBytesImage:any ;

  constructor(private usersService: UsersService, private router:Router) {
    this.usersService.getUserData(localStorage.getItem('name')).subscribe(data=>{
      this.user = data;
      //this.modell = data;

      console.log("User: ", this.user);

      this.usersService.getAdressInfo(this.user.AddressId).subscribe(d=>{
        this.addressFromDb = d;
        this.user.City = this.addressFromDb.City;
        this.user.Street = this.addressFromDb.Street;
        this.user.Number = this.addressFromDb.Number;

        this.user.Birthaday = this.user.Birthaday.split('T')[0];
         this.pp.Id = this.user.Email;

        usersService.getUserImage(this.pp).subscribe(c=>{
          this.userBytesImage = c;
          let x = "data:image/jpg;base64," + this.userBytesImage;
          this.wtfList = x
          console.log("Korisnik", this.user);

          if(this.user.UserTypeId == 3){
            if(this.user.PassangerTypeId == 1 || this.user.PassangerTypeId == 2){
              this.studentOrPensioner = true;
            }
          }
          // if(this.user.PassangerTypeId != null){
          //   if(this.user.UserTypeId == 1 || this.user.UserTypeId == 2)
          //   {
          //     this.studentOrPensioner = true;
          //   }
          // }
          console.log("WTF: ", this.wtfList);
        })


      })
        

      if(this.user.Image.length == 0 && (this.user.PassangerTypeId == 1 || this.user.PassangerTypeId == 2)){
        this.showImageBool = true;
      }else{
        this.showImageBool = false;
      }

    })

    this.userForEdit = new PomAppUserModel("", "", "", "", "", "", "", "", -1);
  }

  ngOnInit() {
  }

  getRole(): string {
    return localStorage.role;
  }

 
  onSubmit(userForEdit: PomAppUserModel, form: NgForm){
    console.log("Korisnik za izmjenu: ", this.userForEdit);

    this.usersService.getAdressInfo(this.user.AddressId).subscribe(s => {

    })

    console.log("Atresaaa: ", this.addressFromDb)
    userForEdit.AddressId = this.user.AddressId
    userForEdit.Id = this.user.Id
    
    this.usersService.editAppUser(userForEdit).subscribe(d=>{
    
      alert("Successful edit user!");
      localStorage.setItem('name', userForEdit.Email);
      window.location.reload();
    })
  }

  onSubmitPassword(pomModelForPassword: PomModelForPassword, form:NgForm){
      this.usersService.editPassword(pomModelForPassword).subscribe(x=>{
        alert("Password seccesfully changed");
        window.location.reload();
      });
  }

  isSelectedPassword(): boolean{
    if(this.selected == 'Password'){
      return true;
    }
  }

  isSelectedEdit(): boolean{
    if(this.selected == 'Edit'){
      return true;
    }
  }

  showEdit(){
    console.log("User:", this.user)
    this.selected = "Edit";
    this.ClickedButtonEdit = true;

    //this.userForEdit.Id = this.user.Id;
    this.userForEdit.Name = this.user.Name;
    this.userForEdit.LastName = this.user.LastName;
    //let newDate = new Date(dateString);
    this.userForEdit.Birthaday = this.user.Birthaday.split('T')[0];

    //this.userForEdit.Image = this.user.Image;
    this.userForEdit.AddressId = this.user.AddressId;
    this.userForEdit.Email = this.user.Email;
    //password se ne podesava

    this.usersService.getAdressInfo(this.user.AddressId).subscribe(s=>{
    this.addressFromDb = s;
    this.userForEdit.City = this.addressFromDb.City;
    this.userForEdit.Number = this.addressFromDb.Number;
    this.userForEdit.Street = this.addressFromDb.Street;

    console.log("Adresaaaa: ", this.addressFromDb);
    });   
  }

  showPassword(){
    this.selected = "Password";
  }

  showImage(event){
    this.selectedImage = event.target.files;
    
      this.showApplyButton = true;
    
  }

  ApplyImage(){
        this.userForEdit.Id = this.user.Id;
        this.userForEdit.Name = this.user.Name;
        this.userForEdit.LastName = this.user.LastName;
        //let newDate = new Date(dateString);
        this.userForEdit.Birthaday = this.user.Birthaday.split('T')[0];
    
        //this.userForEdit.Image = this.user.Image;
        this.userForEdit.AddressId = this.user.AddressId;
        this.userForEdit.Email = this.user.Email;
        //password se ne podesava
    
        this.usersService.getAdressInfo(this.user.AddressId).subscribe(s=>{
        this.addressFromDb = s;
        this.userForEdit.City = this.addressFromDb.City;
        this.userForEdit.Number = this.addressFromDb.Number;
        this.userForEdit.Street = this.addressFromDb.Street;
    
        console.log("Adresaaaa: ", this.addressFromDb);
        if(this.selectedImage == undefined)
      alert("No image selected! ");
    else{
      this.usersService.uploadFile(this.selectedImage).subscribe(d=>{
        alert("Image upload successful!");
        console.log("d", d)
        //this.router.navigate(['/busLines']);
        window.location.reload();
        this.usersService.editAppUser(this.userForEdit).subscribe(dd=>{
          //alert("Image upload successful! ");        
          // console.log("DDDDDDDDD", d)

        })
      });
    }
        }); 

    
  }

  onFileSelected(event){
    this.selectedImage = event.target.files;
    
      this.showApplyButton = true;

    this.selectedImage = event.target.files;
  }
}