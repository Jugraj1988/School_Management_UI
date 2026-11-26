import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAttendance } from './my-attendance';

describe('MyAttendance', () => {
  let component: MyAttendance;
  let fixture: ComponentFixture<MyAttendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAttendance],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAttendance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
