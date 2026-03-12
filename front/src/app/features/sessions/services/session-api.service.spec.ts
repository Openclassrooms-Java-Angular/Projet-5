import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [SessionApiService]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET api/session in all()', () => {
    service.all().subscribe();

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call GET api/session/{id} in detail()', () => {
    service.detail('123').subscribe();

    const req = httpMock.expectOne('api/session/123');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call POST api/session in create()', () => {
    const payload = { name: 'Yoga', description: 'Test' } as any;

    service.create(payload).subscribe();

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('should call PUT api/session/{id} in update()', () => {
    const payload = { id: 1, name: 'Yoga', description: 'Test' } as any;

    service.update('1', payload).subscribe();

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('should call DELETE api/session/{id} in delete()', () => {
    service.delete('1').subscribe();

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call POST api/session/{id}/participate/{userId} in participate()', () => {
    service.participate('1', '42').subscribe();

    const req = httpMock.expectOne('api/session/1/participate/42');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  it('should call DELETE api/session/{id}/participate/{userId} in unParticipate()', () => {
    service.unParticipate('1', '42').subscribe();

    const req = httpMock.expectOne('api/session/1/participate/42');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
