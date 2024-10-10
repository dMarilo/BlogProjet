import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { CategoryType } from 'src/app/models/types';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  animations: [
    trigger('fadeInOutCat', [
       state('void', style({opacity: 0})),
       state('*', style({opacity: 1})),
       transition('void => *',
         animate('300ms ease-in')),
       transition('* => void',
         animate('300ms ease-out'))
    ])
  ]
})

export class CategoryComponent implements AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;
  isCategoryLoading: boolean = true;
  isPageLoading: boolean = true;
  skeletonLoader: number = 4;
  categories: CategoryType[] = [];
  selectedCategoryId: number | null = null;
  visibleCategories: CategoryType[] = [];
  displayedCategoriesCount: number = 2;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.updateVisibleCategories();
      this.isPageLoading = false;
    }, 3000);

    this.getCategoriesData();
    this.dataService.getSelectedCategoryId().subscribe(categoryId => {
      this.selectedCategoryId = categoryId;
      this.isCategoryLoading = false;
    });
  }

  ngAfterViewInit(): void {
    if (this.carousel && this.carousel.nativeElement) {
      console.log('Carousel is ready:', this.carousel.nativeElement);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateVisibleCategories();
  }

  updateVisibleCategories() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1024) {
      this.displayedCategoriesCount = this.categories.length;
    } else if (screenWidth >= 768) {
      this.displayedCategoriesCount = 5;
    } else {
      this.displayedCategoriesCount = 2;
    }
    this.visibleCategories = this.categories.slice(0, this.displayedCategoriesCount);
  }

  getCategoriesData() {
    this.isCategoryLoading = true;
    this.dataService.getDataCategory().subscribe((res: CategoryType[]) => {
      this.categories = res;
      this.isCategoryLoading = false;
    });
  }

  onCategorySelect(categoryId: number) {
    if (this.selectedCategoryId === categoryId) {
      this.dataService.setSelectedCategoryId(null);
    } else {
      this.dataService.setSelectedCategoryId(categoryId);
    }
  }

  // Modified scrollCarousel for smoother scrolling
  scrollCarousel(direction: 'left' | 'right') {
    if (!this.carousel || !this.carousel.nativeElement) {
      console.error('Carousel element is not yet available.');
      return;
    }

    const scrollAmount = this.carousel.nativeElement.offsetWidth * 0.8; // Scroll 80% of the visible width

    if (direction === 'left') {
      this.carousel.nativeElement.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'  // Smooth scrolling behavior
      });
    } else if (direction === 'right') {
      this.carousel.nativeElement.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'  // Smooth scrolling behavior
      });
    }
  }
}
