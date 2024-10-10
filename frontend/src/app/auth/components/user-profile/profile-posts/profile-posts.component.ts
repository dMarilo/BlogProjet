import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/auth.models';
import { PostType } from 'src/app/models/types';

@Component({
  selector: 'app-profile-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.scss'] // Fix: change 'styleUrl' to 'styleUrls'
})
export class ProfilePostsComponent implements OnInit {
  user: User | null = null;
  requestSent = false;
  loading = false;
  posts: PostType[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  paginatedPosts: PostType[] = [];
  noPosts: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserProfile();
    this.fetchThisUsersPosts();
  }

  requestUpgrade() {
    if (this.loading || this.requestSent) return;
    this.loading = true;

    this.authService.requestUpgrade().subscribe(
      response => {
        setTimeout(() => {
          this.requestSent = true;
          this.loading = false;
        }, 1000);
        if (response.success) {
          console.log('Upgrade request sent!');
        } else {
          console.log(response.message);
        }
      },
      error => {
        this.loading = false;
        alert('An error occurred: ' + error.message);
      }
    );
  }

  fetchUserProfile(): void {
    this.authService.getUserProfile().subscribe(
      profile => {
        this.user = profile;
      },
      () => {
        this.user = null;
      }
    );
  }

  fetchThisUsersPosts() {
    this.authService.getLogedUsersPosts().subscribe({
      next: (response) => {
        if (response.success === true) {
          this.posts = response.posts;
          console.log(this.posts);
          console.log("This user has posts!");
          this.noPosts = false;
          this.updatePaginatedPosts(); // Ažuriranje paginacije odmah nakon učitavanja postova
        } else {
          console.log("this user has no posts!");
        }
      },
      error: (err) => {
        console.error("Error fetching posts:", err);
      }
    });
  }

  // Update paginated posts based on current page
  updatePaginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPosts = this.posts.slice(startIndex, endIndex);
  }

  // Pagination methods
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

  navigateToNewPost() {
    this.router.navigate(['/new-post']);
  }
}
