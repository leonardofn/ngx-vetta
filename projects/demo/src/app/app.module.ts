import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgxVettaModule,
  VetDecimalNumberModule,
  VetMaxLengthModule,
  VetOnlyNumberModule,
  VetValidationLabelModule
} from 'ngx-vetta';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxVettaModule,
    VetValidationLabelModule,
    VetDecimalNumberModule,
    VetMaxLengthModule,
    VetOnlyNumberModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
