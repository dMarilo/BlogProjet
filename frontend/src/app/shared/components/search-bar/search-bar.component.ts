import { Component, EventEmitter, Optional, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostType } from 'src/app/models/types'
import { FiltersComponent } from '../filters/filters.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltersComponent, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  animations: [
    trigger('filterState', [
      state('void', style({
        opacity: 0,
        height: '0px',
        overflow: 'hidden'
      })),
      state('*', style({
        opacity: 1,
        height: '*',
        overflow: 'hidden'
      })),
      transition('void => *', [
        animate('300ms ease-in-out')
      ]),
      transition('* => void', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class SearchBarComponent {
  @Output() filterToggled = new EventEmitter<boolean>();
  
  posts:PostType[] = [];
  searchTerm: string = '';
  showFilter: boolean = false;
  filter: string = 'filters'

  form: FormGroup;

  private readonly debounceTimeMs = 300;

  constructor(private dataService: DataService, router:Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      searchTerm: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.form.get('searchTerm')?.valueChanges
    .pipe(
      debounceTime(this.debounceTimeMs),
      distinctUntilChanged()
    )
    .subscribe(searchTerm => {
       this.dataService.setSearchTerm(searchTerm);
       this.dataService.getFilteredPosts().subscribe(posts => {
         this.posts = posts;
       });
    });
  }
  
  toggleFilter() {
    this.showFilter = !this.showFilter;
    this.filter = this.showFilter ? 'Hide' : 'filters';

    this.filterToggled.emit(this.showFilter);
    
    if (!this.showFilter) {
      this.dataService.resetFilters();
      this.form.get('searchTerm')?.setValue(''); // Clear search term
      console.log("Reset Filters...");
    } else {
      this.dataService.getFilteredPosts().subscribe(posts => {
        console.log("Sending filtered posts");
        console.log(posts);
        this.posts = posts;
      });
    } 
  }
  }
