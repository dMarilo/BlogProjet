import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EditorModule
  ],
  providers: [
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
  ]
})
export class PostModule { }
