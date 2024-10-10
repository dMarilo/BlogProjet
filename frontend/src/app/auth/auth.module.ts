import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // For template-driven forms
import { HttpClient, HttpClientModule } from '@angular/common/http'; // For HTTP requests


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AuthModule { }
