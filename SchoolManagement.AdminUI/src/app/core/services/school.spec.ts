import { TestBed } from '@angular/core/testing';
import { School } from './school';

describe('School', () => {
  let service: School;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(School);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
