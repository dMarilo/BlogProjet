import { Component, Input, ViewChild } from '@angular/core';
import { CategoryType, PostType } from 'src/app/models/types';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ModalComponent } from 'src/app/modal/modal.component';

@Component({
  selector: 'app-post-preview',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommentsComponent, CommonModule, ModalComponent],
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})
export class PostPreviewComponent {
  @ViewChild('myModal') modal!: ModalComponent;
  post: PostType | null = null;
  categories: CategoryType[] = [];
  postSlug: string = '';
  isHot: boolean = false;
  isIncrementSuccess: boolean = false;
  isPopular: boolean = false;
  isLiked: boolean = false;
  isSaved: boolean = false;
  postLikes: number = 0;
  postContent: SafeHtml = '';
  subscribedStatus: boolean = false;
  userId: string | null = null;
  buttontext: string = "Subscribe";
  isLogedInStatus: boolean = false;

  //:::::::::::::::::::::::::::::::
  startTime: number = 0;
  endTime: number = 0;
  time: number = 0;
  //:::::::::::::::::::::::::::::::

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.isLogedInStatus = true;
      console.log("Logged in:" + this.isLogedInStatus);
      try {
        const user = JSON.parse(userJson);
        this.userId = user.id;
      } catch (error) {
        console.error('Error parsing user from localstorage', error);
      }
    } else {
      console.warn('No user in local Storage');
    }


    this.startTime = Date.now();

    const slug = this.route.snapshot.paramMap.get('slug');
    this.postSlug = slug !== null ? slug : '';

    if (this.postSlug) {

      this.dataService.getPostBySlug(this.postSlug).subscribe((res: PostType[]) => {
        this.post = res[0];
        this.postContent = this.sanitizer.bypassSecurityTrustHtml(this.post?.content || '');
        this.categories = this.post?.categories || [];


        this.checkSubscriptionStatus();
      });

      this.dataService.incrementViews(this.postSlug).subscribe(response => {
        if (response.success) {
          this.isIncrementSuccess = response.success;
          this.isHot = response.is_hot;
          this.isPopular = response.popular;
          this.postLikes = response.likes;
        } else {
          console.error('Failed somewhere:', response.message);
        }
      });
    }

    this.dataService.checklikedStatus(this.postSlug).subscribe(
      response => {
        if (response.success) {
          console.log("This post was already liked by this user: " + response.liked);
          if (response.liked) {
            this.isLiked = true;
          }
        }
      },
      error =>{
        if (error.status !== 401) {
          console.error("An unexpected error occurred:", error);
        } else {
          console.log("User is not authenticated; unable to check if post is liked.");
        }
      }
    );
    this.dataService.checkSavedPost(this.postSlug).subscribe(
      response => {
        if (response.success) {
          console.log("This post was already saved by this user: " + response.liked);
          if (response.saved) {
            this.isSaved = true;
          }
        }
      },
      error => {
        if (error.status !== 401) {
          console.error("An unexpected error occurred:", error);
        } else {
          console.log("User is not authenticated; unable to check if post is saved.");
        }
      }
    );

  }

  ngOnDestroy(): void {
    this.endTime = Date.now();
    this.readTime();
    console.log(this.time);
  }

  addLike() {
    if (!this.isLiked) {
      this.isLiked = true;
      this.postLikes++;

      this.dataService.incrementLike(this.postSlug).subscribe(response => {
        if (response.success) {
          console.log("Post liked");
        } else {
          console.log("Error liking the post");
        }
      });

      this.dataService.blockMoreLikes(this.postSlug).subscribe(response => {
        if (response.success) {
          console.log("Post locked");
          console.log(response.liked);
        } else {
          console.log("Error blocking the post");
        }
      })
    }
    else
    {
      this.isLiked = false;
      this.postLikes--;
      this.dataService.decrementLike(this.postSlug).subscribe(response => {
        if(response.success) {
          console.log("Post unliked");
        } else {
          console.log("Error liking the post");
        }
      });
      this.dataService.unblockLikes(this.postSlug).subscribe(response => {
        if(response.success) {
          console.log("Post unlocked");
        } else {
          console.log("Error unblocking the post");
        }
      })
    }
  }

  save()
  {
    if(!this.isSaved)
    {
      this.isSaved = true;

      this.dataService.savePost(this.postSlug).subscribe(response => {
        if(response.success) {
          console.log("Post liked");
        } else {
          console.log("Error liking the post");
        }
      })
    }
    else
    {
      this.isSaved = false;
      this.dataService.unSavePost(this.postSlug).subscribe(response => {
        if(response.success) {
          console.log("Post unliked");
        } else {
          console.log("Error liking the post");
        }
      });
    }
  }

  readTime() {
    const timeSpent = (this.endTime - this.startTime) / 1000;
    this.time = timeSpent;
    this.dataService.recordReadingTime(timeSpent).subscribe(
      response => {
        console.log("Reading time recorded!");
        console.log(response.time);
      },
      error => {
        console.error('An error has occurred');
      }
    );
  }

  get formattedCategories(): string {
    return this.post?.categories?.map((category) => category.name).join(', ') || '';
  }

  navigateBack() {
    this.router.navigate(['/']);
  }

  subscribe() {
    if(this.userId && this.post?.user_id)
    {
      if(!this.subscribedStatus)
      {
        this.buttontext = "Subscribed";
        const formData = new FormData();
        formData.append('id', this.post.user_id.toString());
        this.http.post<any>('http://127.0.0.1:8000/api/subscribe', formData)
        .subscribe( response => {
          console.log(response);
          this.subscribedStatus = response.subscribed;
        }, error => {
          console.error('not subscribed', error);
        });
      }
      else
      {
        this.buttontext = "Subscribe";
        const formData = new FormData();
        formData.append('id', this.post.user_id.toString());
        this.http.post<any>('http://127.0.0.1:8000/api/unsubscribe', formData)
        .subscribe( response => {
          if(response.success)
          {
            this.subscribedStatus = false;
            console.log("kkkstatus:" + this.subscribedStatus);
          }
        }, error => {
          console.error('not subscribed aaa', error);
        });
      }
    }
  }

  checkSubscriptionStatus() {
    if (this.userId && this.post?.user_id) {
      const formData = new FormData();
      formData.append('id', this.post.user_id.toString());
      console.log("ne udje ovdje")

      this.http.post<any>('http://127.0.0.1:8000/api/check-subscription', formData)
        .subscribe(response => {
          if (response.success) {
            this.subscribedStatus = response.subscribed;
            console.log("status: ", response.subscribed)
            this.buttontext = this.subscribedStatus ? "Subscribed" : "Subscribe";
          } else {
            console.error('Error checking subscription status', response.message);
          }
        }, error => {
          //console.error('Error checking subscription status', error);
          console.log("Normalno");
        });
    }
  }



  updateCommentsCounter(): void {
    if (this.postSlug) {
      this.dataService.getPostBySlug(this.postSlug).subscribe((res: PostType[]) => {
        this.post = res[0];
        console.log('Broj komentara ažuriran:', this.post.commentsCounter);
      });
    }
  }

  onCommentAdded(): void {
    this.updateCommentsCounter();
  }

  onCommentDeleted(): void {
    if (this.post) {
      this.post.commentsCounter--;
    }
  }

  openModal(message: string) {
    this.modal.show(message);
  }

}
