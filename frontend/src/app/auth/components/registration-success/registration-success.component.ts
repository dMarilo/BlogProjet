import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.scss']
})
export class RegistrationSuccessComponent {

  constructor(private router:Router) {}

  navigateToHome() {
    this.router.navigate(['/']);
  }

}
