import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { AdminNavComponent } from "./admin-nav/admin-nav.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, NavbarComponent, SideMenuComponent, AdminNavComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
