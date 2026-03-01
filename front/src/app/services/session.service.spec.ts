import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
