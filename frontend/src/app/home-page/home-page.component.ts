import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostCardComponent } from '../shared/components/post-card/post-card.component';
import { HeaderComponent } from '../header/header.component';
import { PostDisplayingComponent } from '../shared/components/post-displaying/post-displaying.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone:true,
  imports:[PostCardComponent, HeaderComponent, PostDisplayingComponent, FooterComponent]
})
export class HomePageComponent {
    constructor( private router: Router) {}

    navigateToAuth() {
      this.router.navigate(['/login']);
    }

    
}
