import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/auth.models';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProfilePostsComponent } from '../user-profile/profile-posts/profile-posts.component';
import { PostType } from 'src/app/models/types';
import { HttpClient } from '@angular/common/http';
import { ModalComponent } from 'src/app/modal/modal.component';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [NgClass, ProfilePostsComponent, CommonModule, RouterModule, ModalComponent],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss'
})
export class ProfileViewComponent implements OnInit {
  @ViewChild('myModal') modal!: ModalComponent;
  @Output() subscribeEvent = new EventEmitter<string>();
  userId: string | null = null;
  user: User | null = null;
  isInfoLoading: boolean = true;
  isPageLoading: boolean = true;
  isLogedInStatus: boolean = false;
  posts:PostType[] = [];
  subscribedStatus: boolean = false;
  buttontext: string = "Subscribe";
  age: number = 0;
  formatedDate: string = "";
  subscribers: number = 0;
  currentPage = 1; 
  itemsPerPage = 4; 
  paginatedPosts: PostType[] = [];

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.fetchUserProfile();
    this.fetchThisUsersPosts();
    //this.checkSubscription();
  }

  fetchUserProfile(): void {
    const userJson = localStorage.getItem('user');
    if (userJson){
      this.isLogedInStatus = true;
      if(this.userId){
        this.authService.getUserById(this.userId).subscribe(
          profile => {
            this.user = profile.user;
            console.log(this.user);
            console.log(profile.subscribers);
            this.subscribers = profile.subscribers;


            this.age = profile.age;
            this.subscribedStatus = profile.subscribed;
            console.log("status:" + this.subscribedStatus);
            if(this.user && this.user.profile_pic) {
               this.user.profile_pic = `http://localhost:8000/storage/${this.user.profile_pic}`
            }
            this.isInfoLoading = false;
          },
          error => {
            this.user = null;
            this.isInfoLoading = false;
            console.log("Error");
          }
         )
      }
    }
    else
    {
      if(this.userId){
        this.authService.getUserByIdunlogged(this.userId).subscribe(
          profile => {
            this.user = profile.user;
            console.log(this.user);
            console.log(profile.subscribers);
            this.subscribers = profile.subscribers;


            this.age = profile.age;
            this.subscribedStatus = profile.subscribed;
            console.log("status:" + this.subscribedStatus);
            if(this.user && this.user.profile_pic) {
               this.user.profile_pic = `http://localhost:8000/storage/${this.user.profile_pic}`
            }
            this.isInfoLoading = false;
          },
          error => {
            this.user = null;
            this.isInfoLoading = false;
            console.log("Error");
          }
         )
      }
    }

  }

  subscribe() {
    if(this.userId)
    {
      if(!this.subscribedStatus)
      {
        this.buttontext = "Subscribed";
        const formData = new FormData();
        formData.append('id', this.userId);
        this.http.post<any>('http://127.0.0.1:8000/api/subscribe', formData)
        .subscribe( response => {
          if (response.success) {
            this.subscribedStatus = true;
          }
        }, error => {
          console.error('not subscribed', error);
        });
      }
      else
      {
        this.unsubscribe();
      }
    }
  }

  unsubscribe() {
    if (this.userId) {
      this.buttontext = "Subscribe";
      const formData = new FormData();
      formData.append('id', this.userId);
      this.http.post<any>('http://127.0.0.1:8000/api/unsubscribe', formData)
        .subscribe(response => {
          if (response.success) {
            this.subscribedStatus = false;
          }
        }, error => {
          console.error('Error unsubscribing', error);
        });
    }
  }
  


  fetchThisUsersPosts() {
    if(this.userId){
      this.authService.getLookdForUsersPosts(this.userId).subscribe({
        next: (posts) => {
          this.posts = posts;
          this.updatePaginatedPosts();
        },
        error: (err) => {
          console.error("Error fetching posts:", err);
        }
      });
    }
  }

  openModal(message: string) {
    this.modal.show(message);
  }

  updatePaginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPosts = this.posts.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.posts.length) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getPageNumbers().length) {
      this.currentPage = page;
      this.updatePaginatedPosts();
    }
  }

  getPageNumbers() {
    const totalPages = Math.ceil(this.posts.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

}

