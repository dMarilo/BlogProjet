import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import Dropzone, { DropzoneFile } from "dropzone"

@Component({
  selector: 'app-image-dropzone',
  standalone: true,
  imports: [],
  templateUrl: './image-dropzone.component.html',
  styleUrl: './image-dropzone.component.scss'
})

 export class ImageDropzoneComponent implements AfterViewInit {
   ngAfterViewInit(): void {
     const dropzone = new Dropzone('#dropzone', {
       url: 'http://localhost:8000/api/update-info',
       method: 'POST',
       acceptedFiles: 'image/*',
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
       },
        previewTemplate: `
          <div class="inline-block m-1 dz-preview dz-file-preview">
            <div class="dz-image w-full h-auto overflow-hidden flex justify-center items-center">
             <img data-dz-thumbnail  class="object-cover w-full h-full"/>
            </div>
          </div>
        `,
       init: function() {
        this.on("addedfile", function(file) {
          // Remove the existing message
          document.querySelector('.dz-message');
          // Append the preview to the dz-preview-container
          const previewContainer = document.querySelector('.dz-preview-container');
          previewContainer?.appendChild(file.previewElement);
        });

        this.on("sending", function(file, xhr, formData) {
          formData.append('profile_pic', file);
        });
 
        this.on('success', (file: DropzoneFile, res: any) => {
          console.log('success', res);
        });
 
        this.on('error', (file: DropzoneFile, res: any) => {
          console.log('error', res);
        })
       },
     });
   }
 }

       