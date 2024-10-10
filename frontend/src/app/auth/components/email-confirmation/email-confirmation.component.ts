import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent {

  constructor(private router:Router) {}

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
