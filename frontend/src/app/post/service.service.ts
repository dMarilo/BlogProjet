import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryType, PostType } from '../models/types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:8000/api';

  private params$ = new BehaviorSubject<{ selectedCategories: string; newCategory: string}>({
    selectedCategories: '',
    newCategory: ''
  });


  constructor(private httpClient: HttpClient) {}

  // addPost(postData: any): Observable<PostType> {
  //   return this.httpClient.post<PostType>(`${this.apiUrl}/posts`, postData);
    
  // }

  addCategory(category: Partial<CategoryType>): Observable<CategoryType> {
    return this.httpClient.post<CategoryType>(`${this.apiUrl}/categories`, category);
  }

  getCategories(): Observable<CategoryType[]> {
    return this.httpClient.get<CategoryType[]>(`${this.apiUrl}/categories`);
  }
  
}
