import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { PostType } from '../models/types';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from '../shared/components/filters/filters.component';
import { CategoryComponent } from '../shared/components/category/category.component';
import { SearchBarComponent } from '../shared/components/search-bar/search-bar.component';
import { PostCardComponent } from '../shared/components/post-card/post-card.component';
import { DataService } from '../shared/service/data.service';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, FiltersComponent, CategoryComponent, SearchBarComponent, PostCardComponent, NavbarComponent, FooterComponent],
})
export class BlogsComponent implements OnInit {
  posts: PostType[] = [];
  isPostLoading = true; 
  headerHeight: string = "28rem"

  private readonly debounceTimeMs = 300;

  private searchTermSubscription: Subscription | null = null;
  private postsSubscription: Subscription | null = null;
  private categorySubscription: Subscription | null = null;

  onFilterToggled(showFilter: boolean):void {
    this.headerHeight = showFilter ? '36rem' : '28rem'
  }

  constructor(private http: HttpClient, private dataService: DataService) {}

  ngOnInit(): void {
    this.searchTermSubscription = this.dataService.getSearchTerm().pipe(debounceTime(this.debounceTimeMs)).subscribe((term) => {
      this.getPostData(term);
    });
    this.postsSubscription = this.dataService.getFilteredPosts().pipe(debounceTime(this.debounceTimeMs)).subscribe(posts => {
      console.log("Get Filtred Data...")
      this.posts = posts;
      this.isPostLoading = false; //loading stops when posts are fetched
    });

    this.categorySubscription = this.dataService.getSelectedCategoryId().pipe(debounceTime(this.debounceTimeMs)).subscribe((categoryId) => {
      if (categoryId !== null) {
        this.dataService.getSelectedCategory(categoryId).subscribe((res: PostType[]) => {
          this.posts = res;
          this.isPostLoading = false; //loading stops when category data is fetched
        });
      }
    });


    this.dataService.getDataPost().subscribe((res: PostType[]) => {
      this.dataService.setPosts(res);
      this.isPostLoading = false; //loading stops after initial data is fetched
    });
  }

  getPostData(term: string) {
    this.isPostLoading = true; // loading starts when we are fetching new data
    if (term) {
      this.dataService.getSearchDataPost(term).subscribe((res: PostType[]) => {
        this.posts = res;
        this.isPostLoading = false; // loading stops when serach results are fetched
      });
    } else {
      this.dataService.getDataPost().subscribe((res: PostType[]) => {
        this.posts = res;
        this.isPostLoading = false; //loading stops when fallback data is fetched
      });
    }

  }

  // fetchPosts(): Observable<PostType[]> {
  //   return this.http.get<PostType[]>('http://localhost:8000/api/posts'); 
  // }
}
