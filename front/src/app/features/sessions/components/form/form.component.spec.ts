import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { TeacherService } from 'src/app/services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockSessionApiService: any;
  let mockRouter: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  beforeEach(async () => {
    const sessionApiSpy = {
      create: jest.fn().mockReturnValue(of({})),
      detail: jest.fn().mockReturnValue(of({})),
      update: jest.fn().mockReturnValue(of({}))
    };

    const sessionSpy = {
      isLogged: true
    };

    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: SessionService, useValue: mockSessionService },
        //{ provide: SessionService, useValue: sessionSpy },
        { provide: SessionApiService, useValue: sessionApiSpy },
        { provide: TeacherService, useValue: { all: jest.fn(() => of([])) } },
        { provide: Router, useValue: { navigate: jest.fn(), url: '/sessions/create' } },
        {
          provide: ActivatedRoute, useValue: {
            params: of({ id: '1' }),
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    mockSessionApiService = TestBed.inject(SessionApiService) as any;
    mockRouter = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a session (valid form)', () => {
    fixture.detectChanges();

    expect(component.sessionForm).toBeDefined();

    component.sessionForm!.setValue({
      name: 'Yoga',
      date: '2026-02-28',
      teacher_id: '1',
      description: 'Test',
    });

    component.submit();
    expect(mockSessionApiService.create).toHaveBeenCalled();
  });

  it('should update a session (edit mode)', () => {

    expect(component.sessionForm).toBeDefined();

    component.onUpdate = true;

    component.sessionForm!.setValue({
      name: 'Yoga modifié',
      date: '2026-06-17',
      teacher_id: '1',
      description: 'Description modifiée',
    });

    component.submit();

    expect(mockSessionApiService.update).toHaveBeenCalled();
  });

  it('redirected to /sessions if user is not admin', () => {
    TestBed.resetTestingModule();

    const nonAdminService = { sessionInformation: { admin: false } };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      declarations: [FormComponent],
      providers: [
        FormBuilder,
        { provide: SessionService, useValue: nonAdminService },
        { provide: SessionApiService, useValue: { detail: jest.fn() } },
        { provide: TeacherService, useValue: { all: jest.fn(() => of([])) } },
        { provide: Router, useValue: { navigate: jest.fn(), url: '/sessions/create' } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
      ]
    }).compileComponents();

    const fixture2 = TestBed.createComponent(FormComponent);
    const comp2 = fixture2.componentInstance;
    const routerSpy = jest.spyOn(comp2['router'], 'navigate');

    comp2.ngOnInit();

    expect(routerSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should initialize form correctly in edit mode', () => {
    const session: Session = {
      name: 'Yoga',
      date: new Date().toISOString(),
      teacher_id: '1',
      description: 'Desc',
    } as any;

    component['initForm'](session);

    expect(component.sessionForm!.value).toEqual({
      name: 'Yoga',
      date: new Date(session.date).toISOString().split('T')[0],
      teacher_id: '1',
      description: 'Desc',
    });
  });
});
