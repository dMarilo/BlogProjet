import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Subscription } from 'rxjs';
import { PostType } from 'src/app/models/types';
import { DataService } from '../../service/data.service';
import { CommonModule, NgStyle } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-popular-posts',
  standalone: true,
  imports: [NgStyle, RouterModule, CommonModule],
  templateUrl: './popular-posts.component.html',
  styleUrl: './popular-posts.component.scss'
})
export class PopularPostsComponent implements OnInit, OnDestroy {

  posts: PostType[] = [];
  isPostLoading: boolean = true;
  private postsSubscription: Subscription | null = null;
  private readonly debounceTimeMs = 300;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.postsSubscription = this.dataService.getDataPost().pipe(debounceTime(this.debounceTimeMs)).subscribe(posts => {
      this.posts = this.sortPostsByViews(posts);
      this.isPostLoading = false; // loading stops when posts are fetched
    });
  }

  ngOnDestroy() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  private sortPostsByViews(posts: PostType[]): PostType[] {
    return posts.sort((a, b) => b.views - a.views);
  }
}