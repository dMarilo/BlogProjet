import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommentType, PostType } from 'src/app/models/types';
import { DataService } from '../../service/data.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/modal/modal.component';


@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CommonModule, ModalComponent],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @ViewChild('myModal') modal!: ModalComponent;

  testStatus: boolean = false;
  form: FormGroup;
  isLiked: boolean = false;
  comments: CommentType[] = [];
  userId: number | null = null;
  loading: boolean = false;
  @Input() postSlug: string = '';
  @Output() commentAdded = new EventEmitter<void>();
  @Output() commentDeleted = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private dataService: DataService, private route: ActivatedRoute){
    this.form = this.fb.group({
      content: ''
    });
  }


  async ngOnInit(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userId = user.id;
        console.log("Id: ", this.userId);
      } catch (error) {
        console.error('Error parsing user from localstorage', error);
      }
    } else {
      console.warn('No user in local Storage');
    }
    const slug = this.route.snapshot.paramMap.get('slug');
    this.postSlug = slug !== null ? slug : '';

    if (this.postSlug) {
      try {
        await this.isLogedIn();
      } catch (error) {
        //console.error('Error during login check:', error);
        console.log("Normalno");
      } finally {
        console.log("AAAAA");
        console.log(this.isLogedIn);
        this.loadComments();
      }
    }
  }

  isLogedIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dataService.checkLogedIn().subscribe(
        response => {
          if (response.success) {
            this.testStatus = true;
            resolve();
          } else {
            reject('Login check failed');
          }
        },
        error => {
          this.testStatus = false;
          reject(error);
        }
      );
    });
  }

  loadComments(): void {
    if(this.testStatus == true)
    {
      console.log("BBBBBBB");
      this.dataService.getCommentsByPostSlug(this.postSlug).subscribe((comments) => {
        this.comments = comments;
      });
    }
    else{

      this.dataService.getCommentsByPostSlugUnlogged(this.postSlug).subscribe((comments) => {
        this.comments = comments;
      });
    }
  }

  onSubmit(): void {

    if (this.form.invalid) {
      return;
    }

    const content = this.form.get('content')?.value;
    this.loading = true;
    const slug = this.route.snapshot.paramMap.get('slug');
    this.postSlug = slug !== null ? slug : '';
    if (this.postSlug) {
      this.dataService.incrementComments(this.postSlug).subscribe(response => {
        if (response.success) {
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    }

    this.dataService.addComment(content, this.postSlug).subscribe(
      res => {
        this.form.reset();
        this.commentAdded.emit();
        this.loadComments();
      },
      error => {
        console.error('Error adding comment:', error);
      }

    );
  }

  deleteComment(comment: CommentType): void {
    if(comment.user_id === this.userId){
      if (confirm('Are you sure you want to delete this comment?')) {
        this.dataService.deleteComment(comment.id).subscribe(
          (response) => {
            if (response.success) {
              this.commentDeleted.emit();
              this.loadComments();
            } else {
              console.error('Error deleting comment');
            }
          },
          error => {
            console.error('Error deleting comment:', error);
          }
        );
      }
    }
  }

  likeComment(comment: CommentType): void
  {
    if(comment.liked == true)
    {
      comment.liked = false;
      this.dataService.unlikeComment(comment.id).subscribe(
        (response) => {
          if(response.success) {
            console.log(response.message);
          }
        },
        error => {
          console.error('Something is wrong!');
        }
      )
    }
    else
    {
      comment.liked = true;
      this.dataService.likeComment(comment.id).subscribe(
        (response) => {
          if(response.success) {
            console.log(response.message);
          }
        },
        error => {
          console.error('Something is wrong!');
        }
      )
    }
  }

  openModal(message: string) {
    this.modal.show(message);
  }
}
