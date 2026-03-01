import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { SessionApiService } from '../../services/session-api.service';
import { of, throwError } from 'rxjs';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let sessionApiService: jest.Mocked<SessionApiService>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  const mockSessionApiService: jest.Mocked<SessionApiService> = {
    detail: jest.fn(),
    delete: jest.fn(),
    participate: jest.fn(),
    unParticipate: jest.fn(),
  } as unknown as jest.Mocked<SessionApiService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    })
      .compileComponents();

    sessionApiService = TestBed.inject(
      SessionApiService,
    ) as jest.Mocked<SessionApiService>;

    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;

    sessionApiService.detail.mockReturnValue(of({
      id: 1,
      name: 'Yoga',
      description: 'Test',
      date: new Date().toISOString(),
      teacher_id: 1,
      users: [],
    } as any));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('doit initialiser isAdmin et userId à partir de sessionService', () => {
    expect(component.isAdmin).toBe(true);
    expect(component.userId).toBe('1');
  });

  it('devrait appeler participate() du service et refetch la session', () => {
    sessionApiService.participate.mockReturnValue(of(void 0));

    const spyFetch = jest.spyOn<any, any>(component as any, 'fetchSession');

    component.participate();

    expect(sessionApiService.participate).toHaveBeenCalledWith(
      component.sessionId,
      component.userId,
    );
    expect(spyFetch).toHaveBeenCalled();
  });

  it('devrait appeler unParticipate() du service et refetch la session', () => {
    sessionApiService.unParticipate.mockReturnValue(of(void 0));

    const spyFetch = jest.spyOn<any, any>(component as any, 'fetchSession');

    component.unParticipate();

    expect(sessionApiService.unParticipate).toHaveBeenCalledWith(
      component.sessionId,
      component.userId,
    );
    expect(spyFetch).toHaveBeenCalled();
  });

  it('should call delete and navigate after success', () => {
    sessionApiService.delete.mockReturnValue(of(void 0));
    const matSnackSpy = jest.spyOn(component['matSnackBar'], 'open');

    component.delete();

    expect(sessionApiService.delete).toHaveBeenCalledWith(component.sessionId);
    expect(matSnackSpy).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
  });

  it('should call window.history.back on back()', () => {
    const spy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  it('should compute isParticipate correctly', () => {
    const mockSession = { ...component.session!, users: [1] };
    sessionApiService.detail.mockReturnValue(of(mockSession as any));

    component['fetchSession']();
    expect(component.isParticipate).toBe(true);
  });
});
