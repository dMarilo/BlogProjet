import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgClass],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  sideNav = [
    {
      icon: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z',
      label: "Profile",
      route: "/profile"
    },
    {
      icon: 'M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z',
      label: "Likes",
      route: "/profile/likes"
    },
    {
      icon: 'M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z',
      label: "Saved",
      route: "/profile/saved"
    },
    {
      icon: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm2 1h12v1H6V7zm0 3h12v1H6v-1zm0 3h12v1H6v-1z',
      label: "Mail",
      route: "/profile/messages"  // Define the action for the mail icon
    },
    {
      icon: 'M12 3h-3a1 1 0 0 0-1 1v1H4a1 1 0 0 0-1 1v1h14V6a1 1 0 0 0-1-1h-4V4a1 1 0 0 0-1-1zM3 10v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10H3zm4 6h2v2H7v-2zm0-4h2v2H7v-2zM11 16h2v2h-2v-2zm0-4h2v2h-2v-2z',
      label: "Trash",
      route: "/deletingAccount"
    },
  ];



  activeLink: string = '';
  isExpanded: boolean = false;

  @Output() toggle =new EventEmitter<boolean>();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() =>  {
      this.activeLink = this.router.url;
    });
  }

  isActive(href: string): boolean {
    return this.activeLink === href;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.toggle.emit(this.isExpanded);
  }

  handleTrashAction() {
    console.log("Trash action triggered");
  }

  routeToProfile()
  {
    this.router.navigate(['/profile']);
  }
  routeToLikes()
  {
    this.router.navigate(['/profile/likes']);
  }
  routeToSaved()
  {
    this.router.navigate(['/profile/saved']);
  }

}
