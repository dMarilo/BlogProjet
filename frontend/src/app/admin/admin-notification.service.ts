import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationService {

  private pendingUsersSubject = new BehaviorSubject<number>(0);

  // Observable to share the pending user count
  pendingUsersCount$ = this.pendingUsersSubject.asObservable();

  // Method to update the pending user count
  updatePendingUsersCount(count: number): void {
    this.pendingUsersSubject.next(count);
  }
}
