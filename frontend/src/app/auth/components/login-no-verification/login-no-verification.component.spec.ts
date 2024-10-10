import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNoVerificationComponent } from './login-no-verification.component';

describe('LoginNoVerificationComponent', () => {
  let component: LoginNoVerificationComponent;
  let fixture: ComponentFixture<LoginNoVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginNoVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginNoVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
