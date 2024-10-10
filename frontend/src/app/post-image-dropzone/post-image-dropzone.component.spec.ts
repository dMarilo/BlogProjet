import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostImageDropzoneComponent } from './post-image-dropzone.component';

describe('PostImageDropzoneComponent', () => {
  let component: PostImageDropzoneComponent;
  let fixture: ComponentFixture<PostImageDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostImageDropzoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostImageDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
