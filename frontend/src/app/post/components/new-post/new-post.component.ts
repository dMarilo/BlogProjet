import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../service.service';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CategoryType } from 'src/app/models/types';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { ImageDropzoneComponent } from 'src/app/image-dropzone/image-dropzone.component';
import { PostImageDropzoneComponent } from 'src/app/post-image-dropzone/post-image-dropzone.component';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownComponent,
    CommonModule,
    EditorModule,
    NavbarComponent,
    PostImageDropzoneComponent,
  ],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent {
  form: FormGroup;
  url: any = './assets/admin.jpg';
  categories: CategoryType[] = [];
  err: boolean | null = null;

  apiKey: string = environment.tinyMceApiKey;

  @ViewChild(DropdownComponent) dropdownComponent!: DropdownComponent;

  constructor(
    private fb: FormBuilder,
    private dataService: ServiceService,
    private httpClient: HttpClient,
    private router: Router,
    // private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      title: [''],
      shortDescription: [''],
      content: [''],
      image: [''],
      slug: [''],
      selectedCategories: [[]],
    });

    this.form.get('title')?.valueChanges.subscribe((value) => {
      const slug = this.createSlug(value);
      this.form.get('slug')?.setValue(slug, { emitEvent: false });
    });

    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  createSlug(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  selectedFile(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log('Selected file:', file);

      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
      };

      reader.readAsDataURL(file);


      this.form.patchValue({
        image: this.url, // Set the URL instead of the File object
      });
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append(
      'shortDescription',
      this.form.get('shortDescription')?.value
    );
    formData.append('content', this.form.get('content')?.value);
    formData.append('slug', this.form.get('slug')?.value);

    const storedImageUrl = localStorage.getItem('uploadedImageUrl');
    console.log("AAA" + storedImageUrl);

    if (storedImageUrl) {
      formData.append('image', storedImageUrl);
    }

    const selectedCategories = this.form.get('selectedCategories')?.value || [];
    selectedCategories.forEach((categoryId: number) => {
      formData.append('categoryIds[]', categoryId.toString());
    });
    console.log(formData);
    this.httpClient
      .post('http://127.0.0.1:8000/api/posts', formData)
      .subscribe({
        next: (res) => {
          console.log('Successfully added', res);
          localStorage.removeItem('uploadedImageUrl');
          this.httpClient.post('http://127.0.0.1:8000/api/message', {}).subscribe({
            next: (res) => {
              console.log(res);
            }
          })
          this.form.reset();
          this.router.navigate(['/'])
          this.dropdownComponent.resetDropdown();
          this.url = '';
          this.err = true;
          setTimeout(() => (this.err = null), 3000);
        },
        error: (err) => {
          console.log(this.form);
          console.error('Error adding post', err);
          this.err = false;
          setTimeout(() => (this.err = null), 3000);
        },
      });
  }

  onCategorySelected(categories: CategoryType[]) {
    const selectedCategoryIds = categories.map((category) => category.id);
    console.log(selectedCategoryIds);
    this.form.get('selectedCategories')?.setValue(selectedCategoryIds);
  }

  // getSanitizedContent(): SafeHtml {
  //   const content = this.form.get('content')?.value || '';
  //   return this.sanitizer.bypassSecurityTrustHtml(content)
  // }
}
