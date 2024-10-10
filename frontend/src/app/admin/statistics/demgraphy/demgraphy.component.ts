import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../service/admin-service.service';
import { CommonModule } from '@angular/common';

interface CountryDemographics {
  [key: string]: number;
}

@Component({
  selector: 'app-demgraphy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demgraphy.component.html',
  styleUrls: ['./demgraphy.component.scss']
})
export class DemgraphyComponent implements OnInit {
  countries: { key: string, value: number }[] = [];

  constructor(private adminService: AdminServiceService) {}

  ngOnInit(): void {
    this.adminService.getDemographics().subscribe(data => {
      if (data.success) {
        this.countries = Object.entries(data.countries)
          .map(([key, value]) => ({ key, value: Number(value) }))
          .sort((a, b) => b.value - a.value);
        console.log(this.countries);
      }
    });
  }

  getTotalUsers(): number {
    return this.countries.reduce((total, country) => total + country.value, 0);
  }
}
