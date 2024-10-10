import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminServiceService } from '../service/admin-service.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  statisticsItem = [
    {
      card: 'New User This Month',
      color: 'bg-logo-yellow',
      image: '/assets/admin/670.jpg'
    },
    {
      href: '/admin/datagrowth',
      card: 'User Growth Trends',
      color: 'bg-logo-green',
      image: '/assets/admin/datagrowth.jpg'
    },
    {
      card: 'Views This Month',
      color: 'bg-logo-red',
      image: '/assets/admin/views.jpg'
    },
    {
      href: '/admin/demography',
      card: 'User Demographics',
      color: 'bg-logo-blue',
      image: '/assets/admin/demographics.jpg'
    },
    {
      href: '/admin/chebang',
      card: "This Year's Trends",
      color: 'bg-logo-red',
      image: '/assets/admin/trending.jpg'
    },
    {
      href: '/admin/ageGroups',
      card: 'User Age Groups',
      color: 'bg-logo-green',
      image: '/assets/admin/ageGroups.jpg'
    },
    {
      href: '/admin/followLeaderBoard',
      card: 'Most Followed Bloggers',
      color: 'bg-logo-blue',
      image: '/assets/admin/mostFollowed.jpg'
    },
  ]
  newUsersCount: number = 0;
  totalViews: number | null = null;

  constructor(private adminService: AdminServiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadViews();
    this.adminService.getMonthlyNewcommers().subscribe(response => {
      if (response.success) {
        this.newUsersCount = response.count;
        console.log(response.count);
      } else {
        console.error('Failed to fetch new users count');
      }
    }, error => {
      console.error('Error fetching data:', error);
    });
  }

  loadViews(): void {
    this.adminService.getViews().subscribe(
      data => {
        this.totalViews = data.totalViews; // Use the data from the backend
        console.log(this.totalViews);
      },
      error => {
        console.error('Error fetching views data:', error);
      }
    );
  }
}
