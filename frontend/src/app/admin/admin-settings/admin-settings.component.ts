import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/auth.models';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent implements OnInit {
  user: User | null = null;
    isInfoLoading: boolean = true;
    isPageLoading: boolean = true;

    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
      this.fetchUserProfile()
    }

    fetchUserProfile(): void {
      this.authService.getUserProfile().subscribe(
       profile => {
         this.user = profile;
         if(this.user && this.user.profile_pic) {
            this.user.profile_pic = `http://localhost:8000/storage/${this.user.profile_pic}`
            console.log(this.user.profile_pic);

         }
         this.isInfoLoading = false;
       },
       () => {
         this.user = null;
         this.isInfoLoading = false;
       }
      )
   }

   navigateToEditProfile() {
    this.router.navigate(['/profile/edit'])
  }

}
