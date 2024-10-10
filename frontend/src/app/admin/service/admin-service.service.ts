import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }

  confirmAsBlogger(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/upgradeConfirmation/${userId}`, {});
  }

  getDemographics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/demographics`);
  }
  getAgeGroups(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/ageGroups`);
  }
  getMonthlyNewcommers(): Observable<{ success: boolean, count: number }> {
    return this.http.get<any>(`${this.apiUrl}/statistics/newcommers`);
  }
  getGrowthData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/userGrowth`);
  }
  getViews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/viewsMonth`);
  }

  getUserCounts(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/statistics/users-count-by-month`);
  }

  getFollowLeaderBoard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/mostfollowed`);
  }
}
