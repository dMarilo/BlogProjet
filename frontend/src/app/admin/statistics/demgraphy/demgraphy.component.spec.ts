import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemgraphyComponent } from './demgraphy.component';

describe('DemgraphyComponent', () => {
  let component: DemgraphyComponent;
  let fixture: ComponentFixture<DemgraphyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemgraphyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemgraphyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
