import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';


interface UserCounts {
  [month: string]: number;
}

@Component({
  selector: 'app-users-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-chart.component.html',
  styleUrl: './users-chart.component.scss'
})
export class UsersChartComponent {

  constructor(private http: HttpClient) {
    // Register necessary components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
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
}
