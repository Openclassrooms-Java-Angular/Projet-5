import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule  } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';

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

  it('doit initialiser isAdmin et userId à partir de sessionService', () => {
    expect(component.isAdmin).toBe(true);
    expect(component.userId).toBe('1');
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
