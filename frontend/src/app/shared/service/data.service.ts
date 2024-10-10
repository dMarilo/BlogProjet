import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { PostType, CategoryType, UserType, CommentType } from 'src/app/models/types';



@Injectable({
  providedIn: 'root'
})


export class DataService {
  private apiUrl = 'http://localhost:8000/api';

  private searchTerm$ = new BehaviorSubject<string>('');
  private posts$ = new BehaviorSubject<PostType[]>([]);
  private filteredPosts$ = new BehaviorSubject<PostType[]>([]);
  private selectedCategoryIdSubject = new BehaviorSubject<number | null>(null);

  private readonly debounceTimeMs = 300;

  private filters$ = new BehaviorSubject<{ sortBy: string; sortOrder: string; userId: number | null }>({
    sortBy: 'created_at',
    sortOrder: 'asc',
    userId: null
  });


  constructor(private httpClient: HttpClient) {
    combineLatest([this.searchTerm$, this.filters$, this.selectedCategoryIdSubject]).pipe(
      switchMap(([term, filters, categoryId]) => {
        if (categoryId !== null) {
          return this.getSelectedCategory(categoryId);
        } else {
          return this.getFilteredData(filters.sortBy, filters.sortOrder, filters.userId, term);
        }
      })
    ).subscribe(posts => this.filteredPosts$.next(posts));
  }

  getPostBySlug(slug: string): Observable<PostType[]> {
    return this.httpClient.get<PostType[]>(`${this.apiUrl}/posts?slug=${slug}`);
  }

  getSelectedCategoryId(): Observable<number | null> {
    return this.selectedCategoryIdSubject.asObservable();
  }

  setSelectedCategoryId(categoryId: number | null) {
    this.selectedCategoryIdSubject.next(categoryId);
  }

  setFilters(filters: { sortBy: string; sortOrder: string; userId: number | null }): void {
    this.filters$.next(filters);
  }

  resetFilters(): void {
    this.filters$.next({ sortBy: 'created_at', sortOrder: 'asc', userId: null });
    this.searchTerm$.next('');
  }

  getFilteredPosts(): Observable<PostType[]> {
    return this.filteredPosts$.asObservable();
  }

  setSearchTerm(term: string): void {
    this.searchTerm$.next(term);
  }

  getSearchTerm(): Observable<string> {
    return this.searchTerm$.asObservable();
  }

  setPosts(posts: PostType[]) {
    this.posts$.next(posts);
  }

  getPosts(): Observable<PostType[]> {
    return this.posts$.asObservable();
  }

  getPostById(postId: string): Observable<PostType> {
    return this.httpClient.get<PostType>(`${this.apiUrl}/posts/${postId}`);
  }

  getDataCategory(): Observable<CategoryType[]> {
    return this.httpClient.get<CategoryType[]>(`${this.apiUrl}/categories`);
  }

  getSelectedCategory(categoryId: number): Observable<PostType[]> {
    return this.httpClient.get<PostType[]>(`${this.apiUrl}/posts?category_id=${categoryId}`);
  }

  getDataPost(): Observable<PostType[]> {
    return this.httpClient.get<PostType[]>(`${this.apiUrl}/posts`);
  }

  getMostPopular(): Observable<PostType[]> {
    return this.httpClient.get<PostType[]>(`${this.apiUrl}/popular`);
  }


  getSearchDataPost(searchTerm: string): Observable<PostType[]> {
    return this.httpClient.get<PostType[]>(`${this.apiUrl}/posts/?search=${searchTerm}`);
  }

  getDataUsers(): Observable<UserType[]>{
    return this.httpClient.get<UserType[]>(`${this.apiUrl}/users`);
  }

  getFilteredData(sortBy: string, sortOrder: string, userId: number | null, searchTerm: string): Observable<PostType[]> {
    let params = new HttpParams()
      .set('sort_by', sortBy)
      .set('sort_order', sortOrder);

    if (userId != 0 && userId !== null) {
      params = params.set('user_id', userId.toString());
    }
    if (userId == 0) {
      params = params.delete('user_id');
    }
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.httpClient.get<PostType[]>(`${this.apiUrl}/posts`, { params });
  }

  getCommentsByPostSlug(postSlug: string, orderBy: string = 'created_at'): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/comments_by_post/${postSlug}`);
  }

  getCommentsByPostSlugUnlogged(postSlug: string, orderBy: string = 'created_at'): Observable<CommentType[]> {
    return this.httpClient.get<CommentType[]>(`${this.apiUrl}/comments_by_post`, {
      params: {
        post_slug: postSlug,
        order_by: orderBy
      }
    });
  }

  addComment(content: string, postSlug: string): Observable<any> {
    const body = {
      content: content,
      post_slug: postSlug
    };

    console.log(content);
    console.log(postSlug);

    return this.httpClient.post(this.apiUrl + '/add_comment', body);
  }

  checkLogedIn(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/isLoggedIn`, {});
  }

  incrementCommentLike(commentId: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/comments/${commentId}/like`, {});
  }

  decrementCommentLike(commentId: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/comments/${commentId}/unlike`, {});
  }

  incrementViews(slug: string): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/posts/${slug}/increment-views`, {});
  }

  incrementComments(slug: string): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/posts/${slug}/increment-comments`, {});
  }

  incrementLike(slug: string): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/posts/${slug}/likes`, {}); //::::::::::::::::::::
  }

  decrementLike(slug: string): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/posts/${slug}/unlike`, {});
  }

  blockMoreLikes(slug: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/posts/${slug}/likesLock`, {});
  }

  unblockLikes(slug: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/posts/${slug}/likesUnLock`, {});
  }

  checklikedStatus(slug: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/posts/${slug}/likesCheck`, {});
  }

  savePost(slug: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/posts/${slug}/save`, {});
  }

  unSavePost(slug: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/posts/${slug}/unsave`, {});
  }

  checkSavedPost(slug: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/posts/${slug}/checksave`, {});
  }

  recordReadingTime(timeSpent: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/post/recordedTime`, {timeSpent});
  }

  getCommentsCounter(postSlug: string): Observable<number> {
    return this.httpClient.get<number>(`${this.apiUrl}/posts/${postSlug}/comments-counter`);
  }

  deleteComment(commentId: number) {
    return this.httpClient.post<{ success: boolean }>(`${this.apiUrl}/delete_comment/${commentId}`, {});
  }

  likeComment(commentId: number) {
    return this.httpClient.post<any>(`${this.apiUrl}/like_comment/${commentId}`, {});
  }

  unlikeComment(commentId: number) {
    return this.httpClient.post<any>(`${this.apiUrl}/unlike_comment/${commentId}`, {});
  }





}
