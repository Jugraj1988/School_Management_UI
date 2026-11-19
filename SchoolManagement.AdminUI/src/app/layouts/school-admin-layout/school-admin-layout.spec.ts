import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolAdminLayout } from './school-admin-layout';

describe('SchoolAdminLayout', () => {
  let component: SchoolAdminLayout;
  let fixture: ComponentFixture<SchoolAdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchoolAdminLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolAdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
