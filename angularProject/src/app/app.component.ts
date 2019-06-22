import { Component, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { decode } from 'punycode';
import { NotificationMessage } from './models/notificationMessage.model';
import { RequestsService } from './services/requestsService/requests.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RequestsService],
})
export class AppComponent {
  title = 'angularProject';

  public currentMessage: NotificationMessage;
  public allMessages: any = "";
  public canSendMessage: Boolean;   //Boolean

  constructor(private requestService: RequestsService, 
    private ngZone:NgZone, private toastr:ToastrService){
      this.subscribeToEvents();
      this.canSendMessage = requestService.connectionExists;
  }

  public loggedIn(): string{
    return localStorage.jwt;
  }

  logout(){
    localStorage.clear();
  }

  public showHide(type: string): boolean{
    if(type == "AppUser")
      return true;
    else
      return false;
  }

  showMessage(message: string) {
    this.toastr.success(message, 'New notification!');
  } 

  private subscribeToEvents(): void {   
    this.requestService.connectionEstablished.subscribe(() => {        
        this.canSendMessage = true;  
    });  
    this.requestService.messageReceived.subscribe((message: NotificationMessage) => {  
        this.ngZone.run(() => {  
            this.allMessages = message;
  
             if(!localStorage.jwt) return;
            if (localStorage.role == "Admin"){
              this.showMessage(this.allMessages)
            }
        });  
    });  
  }  

}
