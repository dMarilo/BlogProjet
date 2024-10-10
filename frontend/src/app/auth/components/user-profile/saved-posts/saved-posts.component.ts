import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/auth.models';
import { PostType } from 'src/app/models/types';

@Component({
  selector: 'app-saved-posts',
  standalone: true,
  imports: [CommonModule ,RouterModule],
  templateUrl: './saved-posts.component.html',
  styleUrl: './saved-posts.component.scss'
})
export class SavedPostsComponent implements OnInit{
  user: User | null = null;
  //posts:PostType[] = [];
  users:User[] = [];
  posts: any[] = [];
  isPageLoading: boolean = true;
  isPostLoading: boolean = true;
  constructor(private authService: AuthService){

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isPageLoading = false;
    }, 3000)
    this.loadPosts();
    this.isPostLoading = false;
  }

  loadPosts(): void {
    this.authService.getLogedUsersSavedPosts().subscribe(data => {
      this.posts = data.posts;
      console.log(this.posts);
      this.posts.forEach(post => {
        if (post.user) {
          console.log('User email:', post.user.email);
        }
      });
    });
  }
}
