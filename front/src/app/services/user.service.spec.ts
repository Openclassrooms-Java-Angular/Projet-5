import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error in getById', () => {
    service.getById('1').subscribe({
      next: () => fail('should have failed'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('api/user/1');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error in delete', () => {
    service.delete('1').subscribe({
      next: () => fail('should have failed'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('api/user/1');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
