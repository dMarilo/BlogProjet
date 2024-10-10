import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http'; //
import { CategoryComponent } from '../category/category.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FiltersComponent } from '../filters/filters.component';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/auth.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, CategoryComponent, SearchBarComponent, FiltersComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  adminDrop = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: [
        "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
      ]
    },
    {
      label: 'Statistics',
      href: '/admin/statistics',
      icon: [
      "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" 
      ]
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: [ 
      'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z',
      'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
      ]
    }
  ]

  profileItems = [
    
    {
      label: 'Likes',
      href: '/profile/likes',
      icon: [
        'M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z'
      ]
    },
    {
      label: 'Saved',
      href: '/profile/saved',
      icon: [
        'M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z'
      ]
    },
  ]

  isUserLoggedIn = false;
  user: User | null = null;
  showDropdown: boolean = false;
  isUserBloggerOrAdmin = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}


  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isUserLoggedIn = !!this.authService.getToken();

    this.authService.getUserProfile().subscribe(
      profile => {
        this.user = profile;
        if(this.user.user_type == "Blogger" || this.user.user_type == "Admin"){
          console.log(this.user.user_type)
          this.isUserBloggerOrAdmin = true;
          console.log(this.isUserBloggerOrAdmin = true)
        }
        if(this.user && this.user.profile_pic) {
           this.user.profile_pic = `http://localhost:8000/storage/${this.user.profile_pic}`
        }
      },
      () => {
        this.user = null;
      }
     )

  }

  navigateToRegistration() {
    this.router.navigate(['/register']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToPostBlog(){
    this.router.navigate(['/new-post']);
  }

  navigateToProfile(){
    if(this.user?.user_type === "Admin") {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/profile']);
    }
  }

  updateDatabase() {
    this.router.navigate(['/update-user']);
  }


  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown
  }

  LogOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    this.http.post('http://127.0.0.1:8000/api/logout', {}, {})
      .subscribe( response => {
        console.log('Logged out successfully', response);
      }, error => {
        console.error('Error logging out', error);
      });
  }

}
