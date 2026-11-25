import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherStudents } from './teacher-students';

describe('TeacherStudents', () => {
  let component: TeacherStudents;
  let fixture: ComponentFixture<TeacherStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherStudents],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherStudents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
