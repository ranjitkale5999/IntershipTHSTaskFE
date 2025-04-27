import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddstudComponent } from './StudentReactiveFrom/addstud/addstud.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListstudComponent } from './StudentReactiveFrom/liststud/liststud.component';
import { HttpClientModule } from '@angular/common/http';
import { UpdatestudComponent } from './StudentReactiveFrom/updatestud/updatestud.component';
import {NgSelectModule }  from '@ng-select/ng-select';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    AppComponent,
    AddstudComponent,
    ListstudComponent,
    UpdatestudComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule ,
    HttpClientModule, 
    NgSelectModule ,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
