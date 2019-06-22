import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
// import { HomeComponent } from './components/home/home.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { BusLinesComponent } from './components/bus-lines/bus-lines.component';
import { CvlComponent } from './components/cvl/cvl.component';
import { PriceListComponent } from './components/price-list/price-list.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/interceptor';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ProfileComponent } from './components/profile/profile.component';
import {NgxPopper} from 'angular-popper';
import { StationsComponent } from './components/stations/stations.component';
import { MapComponent } from './components/map/map.component';
import { AgmCoreModule } from '@agm/core';
import { LinesComponent } from './components/lines/lines.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { TimeTableComponent } from './components/time-table/time-table.component';
import { BuyTicketComponent } from './components/buy-ticket/buy-ticket.component';
import { CanActivateViaAuthGuard } from './guard/authGuard';
import { UserLoggedInGuard } from './guard/userLoginGuard';
import { ControlorGuard } from './guard/controllerGuard';
import { RequestsComponent } from './components/requests/requests.component';

import {ToastrModule,ToastNoAnimation,ToastNoAnimationModule,} from 'ngx-toastr';
import { ValidateTicketComponent } from './components/validate-ticket/validate-ticket.component';

import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { AdminGuard } from './guard/adminGuard';
 
const Routes = [
  {
    path: "",
    component: BusLinesComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "logIn",
    component: LogInComponent
  },
  {
    path: "busLines",
    component: BusLinesComponent
  },
  {
    path: "priceList",
    component: PriceListComponent
    // canActivate: [AdminGuard]
  },
  {
    path: "cvl",
    component: CvlComponent
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [UserLoggedInGuard]
  },
  {
    path: "station",
    component: StationsComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "line",
    component: LinesComponent
  },
  {
    path: "vehicle",
    component: VehicleComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "Timetable",
    component: TimeTableComponent
  },
  {
    path: "buyTicket",
    component: BuyTicketComponent
  },
  {
    path:"request",
    component: RequestsComponent,
    canActivate: [AdminGuard]
    
  },
  {
    path:"validetTicket",
    component: ValidateTicketComponent,
    canActivate: [ControlorGuard]
  }


]

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    MenuBarComponent,
    BusLinesComponent,
    CvlComponent,
    PriceListComponent,
    LogInComponent,
    RegisterComponent,
    ProfileComponent,
    StationsComponent,
    MapComponent,
    LinesComponent,
    VehicleComponent,
    TimeTableComponent,
    BuyTicketComponent,
    RequestsComponent,
    ValidateTicketComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(Routes),
    HttpModule,
    HttpClientModule,
    NgxPopper,
    AgmDirectionModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDnihJyw_34z5S1KZXp90pfTGAqhFszNJk'}),
    ToastNoAnimationModule,
    ToastrModule.forRoot({
      toastComponent: ToastNoAnimation,
    }),
    
  ],
  providers: [
    CanActivateViaAuthGuard,
    UserLoggedInGuard,
    ControlorGuard,
    AdminGuard,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}],
  bootstrap: [AppComponent]
})


export class AppModule { }
