import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginReq, LoginRes, PasswordResetReq, PasswordResetRes, RegisterReq, RegisterRes, ResetPasswordData, ResetPasswordDataRes, User } from '../models/auth.models';
import { UserType } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://localhost:8000/api";

  constructor( private http: HttpClient, private router: Router) { }

  register(data: RegisterReq): Observable<RegisterRes> {
    return this.http.post<RegisterRes>(`${this.apiUrl}/register`, data).pipe(
      tap((res: RegisterRes) => {
        if(res.token) {
           this.setToken(res.token)
        }
      })
    );
  }

  login(data: LoginReq): Observable<LoginRes>{
    return this.http.post<LoginRes>(`${this.apiUrl}/login`, data).pipe(
      tap((res: LoginRes) => {
        if(res.token) {
          this.setToken(res.token);
          this.setUser(res.user);

          if(this.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        }
     })
    );
  }

  private setUser(user: User): void {
     localStorage.setItem('user', JSON.stringify(user))
  }

  getUser(): User | null {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user): null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.user_type === 'Admin'
  }

  isBlogger(): boolean{
    const user = this.getUser();
    return user?.user_type === 'Blogger'
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`, {
       headers: {
        Authorization: `Bearer ${this.getToken()}`
       }
      });
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  getUserByIdunlogged(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/unLogged`);
  }

  requestPasswordReset(data: PasswordResetReq): Observable<PasswordResetRes> {
    return this.http.post<PasswordResetRes>(`${this.apiUrl}/password/email`, data);
  }

  resetPassword(data: ResetPasswordData): Observable<ResetPasswordDataRes> {
    return this.http.post<ResetPasswordDataRes>(`${this.apiUrl}/password/reset`, data);
  }

  logout(data:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  //......................................
  checkUserVerification(): Observable<{ isVerified: boolean }> {
    return this.http.get<{ isVerified: boolean }>(`${this.apiUrl}/verification-status`);
  }

  requestUpgrade(): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/upgradeRequest`, {});
  }

  private countryUrl = 'https://restcountries.com/v3.1/all';
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.countryUrl);
  }

  getLogedUsersPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usersPosts`);
  }

  getLogedUsersSavedPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usersSavedPosts`);
  }

  getLookdForUsersPosts(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/specificUsersPosts/${userId}`);
  }

  subscribe(): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscribe`, {});
  }

  getBloggers(): Observable<UserType[]> {
    return this.http.get<UserType[]>('http://localhost:8000/api/bloggers')
  }
}
