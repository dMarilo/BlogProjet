import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDropzoneComponent } from './image-dropzone.component';

describe('ImageDropzoneComponent', () => {
  let component: ImageDropzoneComponent;
  let fixture: ComponentFixture<ImageDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageDropzoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
