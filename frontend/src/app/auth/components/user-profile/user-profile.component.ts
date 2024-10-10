import { Component } from '@angular/core';
import { SideNavComponent } from './side-nav/side-nav.component';
import { RouterModule } from '@angular/router';
import { ProfileInfoComponent } from "./profile-info/profile-info.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SideNavComponent, RouterModule, ProfileInfoComponent, NgClass],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
isExpanded = false;

toggleExpand(expanded: boolean) {
  this.isExpanded = !this.isExpanded;
}
}
