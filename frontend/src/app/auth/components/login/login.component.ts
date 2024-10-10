import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   headerText: string = "";

   constructor(private route: ActivatedRoute, private router: Router) {}


   ngOnInit(): void {
     this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
     ).subscribe(() => {
      this.updateComponentState();
     });

     this.updateComponentState();
   }

   private updateComponentState(): void {
    const url = this.router.url;
    if(url.endsWith("register")) {
      this.headerText = "Sign Up";
    } else if(url.endsWith('reset-password-request' || 'reset-password')) {
      this.headerText = "Reset Password";
    } else {
      this.headerText = "Log In";
    }
   }
}
