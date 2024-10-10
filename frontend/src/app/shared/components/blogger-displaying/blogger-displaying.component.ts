import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserType } from 'src/app/models/types';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blogger-displaying',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './blogger-displaying.component.html',
  styleUrl: './blogger-displaying.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({opacity: 0})),
      state('*', style({opacity: 1})),
      transition('void => *',
        animate('1000ms ease-in')),
      transition('* => void',
        animate('1000ms ease-out'))
    ])
  ]
})
export class BloggerDisplayingComponent implements OnInit {
  bloggers: UserType[] = [];
  isPageLoading: boolean = true;
  isBloggerLoading: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchBloggers();
  }

  fetchBloggers() {
    this.isPageLoading = true;
    this.isBloggerLoading = true;
    this.authService.getBloggers().subscribe({
      next: (bloggers: UserType[]) => {
        this.bloggers = bloggers;
        this.isPageLoading = false;
        this.isBloggerLoading = false;
      }, 
      error: (error) => {
        console.error('Error fetching bloggers:', error);
        this.isPageLoading = false;
        this.isBloggerLoading = false;
      }
    })
  }
}
