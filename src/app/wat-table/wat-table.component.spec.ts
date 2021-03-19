import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatTableComponent } from './wat-table.component';

describe('WatTableComponent', () => {
  let component: WatTableComponent;
  let fixture: ComponentFixture<WatTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
