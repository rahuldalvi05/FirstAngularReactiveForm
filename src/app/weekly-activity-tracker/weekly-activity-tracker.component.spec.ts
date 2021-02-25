import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyActivityTrackerComponent } from './weekly-activity-tracker.component';

describe('WeeklyActivityTrackerComponent', () => {
  let component: WeeklyActivityTrackerComponent;
  let fixture: ComponentFixture<WeeklyActivityTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyActivityTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyActivityTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
