import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-no-verification',
  standalone: true,
  imports: [],
  templateUrl: './login-no-verification.component.html',
  styleUrl: './login-no-verification.component.scss'
})
export class LoginNoVerificationComponent {
  constructor(private router: Router) { }

  retry() {
    this.router.navigate(['/']);
  }
}
