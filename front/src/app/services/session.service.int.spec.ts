import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService (intégration)', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService]
    });

    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('logIn doit mettre à jour sessionInformation, isLogged et émettre true', (done) => {
    const sessionInfo: SessionInformation = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'john',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    };

    service.$isLogged().subscribe((value) => {
      expect(value).toBe(true);
      done();
    });

    service.logIn(sessionInfo);

    expect(service.sessionInformation).toEqual(sessionInfo);
    expect(service.isLogged).toBe(true);
  });

  it('should set isLogged to false and clear sessionInformation when logOut is called', (done) => {
    const sessionInfo: SessionInformation = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'john',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    };
    service.logIn(sessionInfo);

    service.$isLogged().subscribe((value) => {
      expect(value).toBe(false);
      done();
    });

    service.logOut();

    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
  });
});