import { Component } from '@angular/core';
import { AdminServiceService } from '../../service/admin-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard-followers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard-followers.component.html',
  styleUrl: './leaderboard-followers.component.scss'
})
export class LeaderboardFollowersComponent {
  users: any[] = [];
  subscribers: number = 0;

  constructor(private adminService: AdminServiceService) {}

  ngOnInit(): void {
    this.adminService.getFollowLeaderBoard().subscribe(data => {
      if (data.success) {
        this.users = data.mostFollowed;
        this.subscribers = data.subscribers;

        console.log(this.users);
      }
    });
  }
}
