import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentLayout } from './student-layout';

describe('StudentLayout', () => {
  let component: StudentLayout;
  let fixture: ComponentFixture<StudentLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
