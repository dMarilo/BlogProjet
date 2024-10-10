import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDisplayingComponent } from './post-displaying.component';

describe('PostDisplayingComponent', () => {
  let component: PostDisplayingComponent;
  let fixture: ComponentFixture<PostDisplayingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDisplayingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDisplayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
