import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-update.component.html'
})
export class ProfileUpdateComponent {
  model = {
    about: '',
    gender: '',
    user_type: '',
    birthdate: '',
    profile_picture: null
  };

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.model.profile_picture = event.target.files[0];
    }
  }

  onSubmit() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const formData = new FormData();
    formData.append('about', this.model.about);
    formData.append('gender', this.model.gender);
    formData.append('user_type', this.model.user_type);
    formData.append('birthdate', this.model.birthdate);

    if (this.model.profile_picture) {
      formData.append('profile_picture', this.model.profile_picture);
    }

    this.http.post('http://127.0.0.1:8000/api/update-database', formData, { headers })
      .subscribe( response => {
        console.log('Database updated successfully', response);
      }, error => {
        console.error('Error updating database', error);
      });
  }
}
