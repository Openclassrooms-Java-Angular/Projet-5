import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService]
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('all() should fetch all teachers', () => {
    const mockTeachers: Teacher[] = [
      { id: 1, lastName: 'T1', firstName: 'T1' } as Teacher,
      { id: 2, lastName: 'T2', firstName: 'T2' } as Teacher
    ];

    service.all().subscribe(teachers => {
      expect(teachers.length).toBe(2);
      expect(teachers).toEqual(mockTeachers);
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('detail() should fetch a teacher by id', () => {
    const mockTeacher: Teacher = { id: 1, lastName: 'T1', firstName: 'T1' } as Teacher;

    service.detail('1').subscribe(teacher => {
      expect(teacher).toEqual(mockTeacher);
    });

    const req = httpMock.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });

  it('all() should handle error', () => {
    service.all().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: error => expect(error.status).toBe(500)
    });

    const req = httpMock.expectOne('api/teacher');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('detail() should handle error', () => {
    service.detail('1').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: error => expect(error.status).toBe(404)
    });

    const req = httpMock.expectOne('api/teacher/1');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});