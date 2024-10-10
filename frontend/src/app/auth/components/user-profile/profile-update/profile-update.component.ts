import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatNativeDateModule } from "@angular/material/core"
import { ImageDropzoneComponent } from "../../../../image-dropzone/image-dropzone.component";
import { CommonModule, formatDate } from '@angular/common';
import { User } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/auth/auth.service';
import Dropzone from 'dropzone';


@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ImageDropzoneComponent, CommonModule
],
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.scss'
})

export class ProfileUpdateComponent implements OnInit {
  profileEditForm: FormGroup;
  user: User | null = null;
  countries: any[] = [];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.profileEditForm = this.fb.group({
      about: ['', Validators.maxLength(255)],
      gender: [''],
      user_type: [''],
      country: [''],
      birth: ['', Validators.required],
      profile_pic: [null]
    })
  }

  ngOnInit(): void {
    this.fetchUserInfo();
    this.fetchCountries();
  }

  fetchUserInfo(): void {
   this.authService.getUserProfile().subscribe(profile => {
    this.user = profile;
    if(this.user) {
      this.profileEditForm.patchValue({
        about: this.user.about || '',
        gender: this.user.gender || '',
        user_type: this.user.user_type || '',
        country: this.user.country || '',
        birth: this.user.birth ? formatDate(this.user.birth, 'yyyy-MM-dd', 'en-US') : '',
        profile_pic: this.user.profile_pic || null
      });
    }
   });
  }

  fetchCountries(): void {
    this.authService.getCountries().subscribe(data => {
      this.countries = data.map(country => ({
        value: country.name.common
      }));
      console.log(this.countries); // Log after the data is assigned
    }, error => {
      console.error('Error fetching countries', error);
    });
  }

  onSubmit(): void {
    if(this.profileEditForm.valid) {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

     const formData = new FormData();

     for(const key in this.profileEditForm.controls) {
      if (this.profileEditForm.controls[key]. value) {
        let value = this.profileEditForm.controls[key].value;

        if(key === "birth") {
          value = formatDate(value, 'yyyy-MM-dd', 'en-US');
        }

        console.log(`Appending ${key}: ${value}`);
        formData.append(key, value)
      }
    }


      const profilePicControl = this.profileEditForm.controls['profile_pic'];
      if (profilePicControl && profilePicControl.value instanceof File) {
        const file = profilePicControl.value;
        formData.append('profile_pic', file, file.name);
      }

     this.http.post('http://127.0.0.1:8000/api/update-info', formData, { headers })
       .subscribe({
        next: (res) => {
          console.log('Database updated succesfully', res);
          },
          error: (err) => {
            console.error('Error updating database', err);

            if (err.error) {
              console.error('Error details:', err.error);
            }
          }
       });

       this.profileEditForm.reset();

       if(this.user?.user_type === 'Admin') {
         this.router.navigate(['/admin/settings'])
       } else {
         this.router.navigate(['/profile'])
       }
    }
  }

  navigateBack() {
    if(this.user?.user_type === 'Admin') {
      this.navigateBackAdmin();
    } else {
      this.back()
    }
  }

  back() {
    this.router.navigate(['/profile'])
  }
  
  navigateBackAdmin() {
    this.router.navigate(['/admin/settings'])
  }

}
