import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserType } from 'src/app/models/types';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  form: FormGroup;
  users: UserType[] = [];

  private readonly debounceTimeMs = 300;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      sortBy: new FormControl('created_at'),
      sortOrder: new FormControl('asc'),
      userId: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.getUsersData();
    this.form.valueChanges.pipe(debounceTime(this.debounceTimeMs)).subscribe(values => {
      this.applyFilters(values);
    });
  }

  applyFilters(values: any) {
    const { sortBy, sortOrder, userId } = values;
    this.dataService.setFilters({ sortBy, sortOrder, userId });
    console.log("Apply filters...")
    console.log(values);
  }

  getUsersData() {
    this.dataService.getDataUsers().subscribe((res: UserType[]) => {
      this.users = res;
    }
    );
  }
}