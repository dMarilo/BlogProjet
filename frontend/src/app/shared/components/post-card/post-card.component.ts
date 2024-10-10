import { Component, Input } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../service/data.service';
import { PostType } from 'src/app/models/types'
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, NgStyle, RouterModule, NgxPaginationModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
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
export class PostCardComponent {

  
  posts:PostType[] = [];
  isPageLoading: boolean = true;
  isPostLoading: boolean = true;
  skeletonLoader: number = 4;
  logedId: number = 0;
  currentPage: number = 1;  
  itemsPerPage: number = 4;

  private searchTermSubscription: Subscription | null = null;
  private postsSubscription: Subscription | null = null;
  private categorySubscription: Subscription | null = null;

  private readonly debounceTimeMs = 300;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {

    setTimeout(() => {
      this.isPageLoading = false;
    }, 2000)

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

    const userJson = localStorage.getItem('user');
    if(userJson){
      try{
        const user = JSON.parse(userJson);
        this.logedId = user.id;
        console.log("Id: ", this.logedId);

      } catch(error) {
        console.error('Error parsing user from localstorage', error);
      }
    }
    else
    {
      console.warn('No user in local Storage');
    }

  }
  
  get totalPages(): number {
    return Math.ceil(this.posts.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
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


  ngOnDestroy() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

  trackByPost(index: number, post: PostType): number {
    return post.id;
  }

  navigateToProfile(){
    this.router.navigate(['/profile-view'])
  }

}
