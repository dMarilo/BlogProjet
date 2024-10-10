import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { User } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminServiceService } from '../service/admin-service.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgStyle, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  cardItems = [
    {
      href: '/admin/blogs',
      card: 'Blogs',
      color: 'bg-logo-red',
      image: '/assets/admin/790.jpg'
    },
    { 
      href: '/admin/users',
      card: 'Users',
      color: 'bg-logo-blue',
      image: '/assets/admin/user.jpg'
    },
    { 
      href: '/admin/statistics',
      card: 'Statistics',
      color: 'bg-logo-green',
      image: '/assets/admin/statistics.jpg'
    },
    { 
      href: '/admin/categories',
      card: 'Categories',
      color: 'bg-logo-yellow',
      image: '/assets/admin/categories.jpg'
    },
    // { 
    //   href: '/',
    //   card: 'Home Page',
    //   color: 'bg-logo-red',
    //   image: '/assets/admin/home.png'
    // }
  ]

  currentIndex = 0;
  slideWidth = 288; // width of the card including margins/padding (72px width + 10px space)
  users: any[] = [];

  constructor(private http: HttpClient, private adminService: AdminServiceService, private authService: AuthService) {
    // Register necessary components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadUsers();
    this.http.get<{ [month: string]: number }>('http://localhost:8000/api/statistics/users-count-by-month')
      .subscribe(data => {
        const labels = Object.keys(data);
        const values = Object.values(data);

        // Create the chart
        const ctx = document.getElementById('userChart') as HTMLCanvasElement;

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'User Registrations',
              data: values,
              backgroundColor: '#4a90e2',
              borderColor: '#357ABD',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.dataset.label}: ${context.raw}`;
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Month'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Users'
                },
                ticks: {
                  callback: function (value) {
                    return value.toLocaleString(); // Add commas to numbers
                  }
                }
              }
            }
          }
        });
      });
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
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  nextSlide() {
    if (this.currentIndex < this.cardItems.length * this.slideWidth) {
      this.currentIndex += this.slideWidth;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.slideWidth;
    }
  }

}
