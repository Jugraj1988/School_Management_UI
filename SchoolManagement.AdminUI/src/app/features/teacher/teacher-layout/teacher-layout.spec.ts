import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherLayout } from './teacher-layout';

describe('TeacherLayout', () => {
  let component: TeacherLayout;
  let fixture: ComponentFixture<TeacherLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
