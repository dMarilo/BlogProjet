import { Component, OnInit } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { BloggerDisplayingComponent } from '../blogger-displaying/blogger-displaying.component';
import { PopularPostsComponent } from "../popular-posts/popular-posts.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-displaying',
  standalone: true,
  imports: [PostCardComponent, BloggerDisplayingComponent, PopularPostsComponent, RouterModule],
  templateUrl: './post-displaying.component.html',
  styleUrl: './post-displaying.component.scss'
})
export class PostDisplayingComponent {
}
