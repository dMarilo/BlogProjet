import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-profile',
  standalone: true,
  imports: [],
  templateUrl: './delete-profile.component.html',
  styleUrl: './delete-profile.component.scss'
})
export class DeleteProfileComponent {

  constructor(private router: Router, private http: HttpClient) {}

  onDeleteAccount() {
    this.http.post('http://127.0.0.1:8000/api/delete', {}, {})
      .subscribe( response => {
        console.log('Account deleted successfully', response);
      }, error => {
        console.error('Error logging out', error);
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/']);
  }

}
