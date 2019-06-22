import { Injectable, EventEmitter } from '@angular/core';
import { NotificationMessage } from 'src/app/models/notificationMessage.model';
import { BehaviorSubject } from 'rxjs';


Injectable({
  providedIn: 'root'
})
declare var $: any; 
export class RequestsService {

  private proxy: any;  
  private proxyName: string = 'notifications';  
  private connection: any;

   public messageReceived: EventEmitter <NotificationMessage> ;  
  public connectionEstablished: EventEmitter <Boolean> ;  
  public connectionExists: Boolean; 

   private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

   constructor() { 
      this.connectionEstablished = new EventEmitter <Boolean> ();  
      this.messageReceived = new EventEmitter <NotificationMessage> ();  
      this.connectionExists = false;

       this.connection = $.hubConnection('http://localhost:52295/');
      this.proxy = this.connection.createHubProxy(this.proxyName);      
      this.registerOnServerEvents();  
      this.startConnection();       
  }

   public sendNotification() {  
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('NotifyAdmin');  
  }    

   public sendServiceNotification() {  
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('NotifyAdminService');  
  }  

   private startConnection(): void {  
    this.connection.start().done((data: any) => {  
        console.log("Uspesna konekcija")
        this.connectionEstablished.emit(true);  
        this.connectionExists = true;  
    }).fail((error: any) => {          
        console.log('Could not connect ' + error);
        this.connectionEstablished.emit(false);  
    });  
  }  

   private registerOnServerEvents(): void {  
    this.proxy.on('sendNotification', (data: NotificationMessage) => {  
        this.messageReceived.emit(data);  
    });  
  } 

   changeMessage(message: string) {
    this.messageSource.next(message)
  }
}
