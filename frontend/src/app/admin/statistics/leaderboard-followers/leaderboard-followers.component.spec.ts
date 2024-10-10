import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardFollowersComponent } from './leaderboard-followers.component';

describe('LeaderboardFollowersComponent', () => {
  let component: LeaderboardFollowersComponent;
  let fixture: ComponentFixture<LeaderboardFollowersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardFollowersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardFollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
