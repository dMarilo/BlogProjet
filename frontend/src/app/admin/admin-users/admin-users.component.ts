import { Component } from '@angular/core';
import { AdminServiceService } from '../service/admin-service.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { AdminNotificationService } from '../admin-notification.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, SideMenuComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {
  users: any[] = [];
  confirmationMessages: { [key: number]: string } = {};
  loading: boolean = false;
  pendingUsersCount: number = 0

  constructor(private adminService: AdminServiceService, private adminNotificationService: AdminNotificationService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe(
      (data) => {
        this.users = data.sort((a, b) => {
          if (a.user_type === 'pending' && b.user_type !== 'pending') {
            return -1;
          } else if (a.user_type !== 'pending' && b.user_type === 'pending') {
            return 1;
          } else {
            return 0;
          }
        });

        this.pendingUsersCount = this.users.filter(user => user.user_type === 'pending').length;
        this.adminNotificationService.updatePendingUsersCount(this.pendingUsersCount)
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  confirmAsBlogger(userId: number): void {
    this.loading = true;
    this.adminService.confirmAsBlogger(userId).subscribe(
      (response) => {
        if (response.success) {
          console.log("Success");
          this.loadUsers();     
          this.loading = false;
        } else {
          console.log("Error");
          this.loading = false;
        }
      },
      (error) => {
        console.log('An error occurred: ' + error.message);
        this.loading = false;
      }
    );
  }

}
