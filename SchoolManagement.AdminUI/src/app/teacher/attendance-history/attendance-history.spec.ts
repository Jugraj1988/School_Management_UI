import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendanceHistory } from './attendance-history';

describe('AttendanceHistory', () => {
  let component: AttendanceHistory;
  let fixture: ComponentFixture<AttendanceHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendanceHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(AttendanceHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
