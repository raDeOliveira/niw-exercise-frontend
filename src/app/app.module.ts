import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MatInputModule} from '@angular/material/input';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {FlexLayoutModule} from '@ngbracket/ngx-layout';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService} from "./service/api.service";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {ModalComponent} from './components/modal/modal.component';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardHeader, MatCardTitle} from "@angular/material/card";

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButton,
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle
  ],
  providers: [
    provideAnimationsAsync(),
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
