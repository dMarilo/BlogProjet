import { Component } from '@angular/core';
import { AdminServiceService } from '../../service/admin-service.service';

@Component({
  selector: 'app-growth-data',
  standalone: true,
  imports: [],
  templateUrl: './growth-data.component.html',
  styleUrl: './growth-data.component.scss'
})
export class GrowthDataComponent {
  growthData: any = {
    growthWeek: 0,
    growthMonth: 0,
    growthQuarter: 0,
    growthYear: 0
  };

  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.adminService.getGrowthData().subscribe(data => {
      this.growthData = data;
    });
  }
}
