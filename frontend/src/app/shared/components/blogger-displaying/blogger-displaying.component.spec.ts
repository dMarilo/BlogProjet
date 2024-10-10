import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloggerDisplayingComponent } from './blogger-displaying.component';

describe('BloggerDisplayingComponent', () => {
  let component: BloggerDisplayingComponent;
  let fixture: ComponentFixture<BloggerDisplayingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloggerDisplayingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloggerDisplayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
