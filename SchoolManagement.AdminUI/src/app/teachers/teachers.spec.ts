import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Teachers } from './teachers';

describe('Teachers', () => {
  let component: Teachers;
  let fixture: ComponentFixture<Teachers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Teachers],
    }).compileComponents();

    fixture = TestBed.createComponent(Teachers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
