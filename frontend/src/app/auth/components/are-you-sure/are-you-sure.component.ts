import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-are-you-sure',
  standalone: true,
  imports: [],
  templateUrl: './are-you-sure.component.html',
  styleUrl: './are-you-sure.component.scss'
})
export class AreYouSureComponent {
  selectedReason: string = '';
  router: any;

  constructor(private http: HttpClient) {}

  onDeleteAccount() {
    this.http.post('http://127.0.0.1:8000/api/delete', {}, {})
      .subscribe( response => {
        console.log('Account deleted successfully', response);
      }, error => {
        console.error('Error logging out', error);
      });
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
  }
}
