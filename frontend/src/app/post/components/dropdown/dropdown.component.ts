import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryType } from 'src/app/models/types';
import { ServiceService } from '../../service.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  form: FormGroup;
  categories: CategoryType[] = [];
  selectedCategories: CategoryType[] = [];
  dropdownOpen: boolean = false;

  @Output() categorySelected = new EventEmitter<CategoryType[]>();

  constructor(private fb: FormBuilder, private postService: ServiceService) {
    this.form = this.fb.group({
      selectedCategories: [[]],  
    });
  }

  ngOnInit() {
    this.postService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleCategory(category: CategoryType) {
    const selectedCategoryIds = this.form.get('selectedCategories')?.value || [];
    const isSelected = selectedCategoryIds.includes(category.id);

    if(isSelected) {
      this.form.get('selectedCategories')?.setValue(selectedCategoryIds.filter((id: number) => id !== category.id));
    } else {
      this.form.get('selectedCategories')?.setValue([...selectedCategoryIds, category.id]);
    }

    this.onCategoryChange()
  }

  onCategoryChange() {
    const selectedCategoryIds = this.form.get('selectedCategories')?.value || [];
    this.selectedCategories = this.categories.filter(category => selectedCategoryIds.includes(category.id));
    this.categorySelected.emit(this.selectedCategories);
  }

  isSelected(category: CategoryType): boolean {
    return this.selectedCategories.some(selected => selected.id === category.id)
  }
  
  removeCategory(category: CategoryType) {
    const selectedCategoryIds = this.form.get('selectedCategories')?.value || [];
    this.form.get('selectedCategories')?.setValue(selectedCategoryIds.filter((id: number) => id !== category.id));
    this.onCategoryChange();
  }

  resetDropdown() {
    this.form.reset({ selectedCategories: [] });
    this.selectedCategories = [];
    this.dropdownOpen = false;
  }

  get selectedCategoryNames() {
    return this.selectedCategories.map(category => category.name).join(', ');
  }
}
