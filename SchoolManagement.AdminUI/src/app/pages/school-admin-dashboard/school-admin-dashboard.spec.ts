import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolAdminDashboard } from './school-admin-dashboard';

describe('SchoolAdminDashboard', () => {
  let component: SchoolAdminDashboard;
  let fixture: ComponentFixture<SchoolAdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchoolAdminDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolAdminDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
