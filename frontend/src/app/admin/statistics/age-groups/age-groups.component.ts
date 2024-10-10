import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../service/admin-service.service';
import { CommonModule } from '@angular/common';

interface IageGroups {
  [key: string]: number;
}

@Component({
  selector: 'app-age-groups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './age-groups.component.html',
  styleUrls: ['./age-groups.component.scss']
})
export class AgeGroupsComponent implements OnInit {
  ageGroups: { key: string, value: number }[] = [];

  constructor(private adminService: AdminServiceService) {}

  ngOnInit(): void {
    this.adminService.getAgeGroups().subscribe(data => {
      if (data.success) {
        this.ageGroups = Object.entries(data.ageGroups)
          .map(([key, value]) => ({ key, value: Number(value) }))
          .sort((a, b) => b.value - a.value);
        console.log(this.ageGroups);
      }
    });
  }

  getTotalUsers(): number {
    return this.ageGroups.reduce((total, ageGroup) => total + ageGroup.value, 0);
  }
}
