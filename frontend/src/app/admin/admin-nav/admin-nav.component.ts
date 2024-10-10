import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/auth.models';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.scss'
})
export class AdminNavComponent implements OnInit{

  user: User | null = null;
  adminName: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if(user) {
      this.adminName = user.first_name;
      this.fetchUserProfile();      
    }
  }

  fetchUserProfile(): void {
    this.authService.getUserProfile().subscribe(
     profile => {
       this.user = profile;
       if(this.user && this.user.profile_pic) {
          this.user.profile_pic = `http://localhost:8000/storage/${this.user.profile_pic}`
          console.log(this.user.profile_pic);

       }
     },
     () => {
       this.user = null;
     }
    )
 }

}
