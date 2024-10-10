import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { CategoryComponent } from '../shared/components/category/category.component';
import { SearchBarComponent } from '../shared/components/search-bar/search-bar.component';
import { FiltersComponent } from '../shared/components/filters/filters.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavbarComponent, CategoryComponent, SearchBarComponent, FiltersComponent, NgStyle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  headerHeight: string = "28rem"

  onFilterToggled(showFilter: boolean):void {
    this.headerHeight = showFilter ? '36rem' : '28rem'
  }
  
}
