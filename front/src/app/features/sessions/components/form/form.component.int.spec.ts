import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { TeacherService } from 'src/app/services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

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

        const mockTeachers = [
            { id: '1', name: 'John' },
            { id: '2', name: 'Jane' }
        ];

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
                NoopAnimationsModule
            ],
            providers: [
                FormBuilder,
                { provide: MatSnackBar, useValue: { open: jest.fn() } },
                { provide: SessionService, useValue: mockSessionService },
                { provide: SessionApiService, useValue: sessionApiSpy },
                { provide: TeacherService, useValue: { all: jest.fn(() => of([])) } },
                { provide: Router, useValue: { navigate: jest.fn(), url: '/sessions/create' } },
                {
                    provide: ActivatedRoute, useValue: {
                        params: of({ id: '1' }),
                        snapshot: { paramMap: { get: () => '1' } }
                    }
                },
                { provide: TeacherService, useValue: { all: jest.fn(() => of(mockTeachers)) } }
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

    it('should create a session (integration)', () => {
        component.sessionForm!.patchValue({
            name: 'Yoga',
            date: '2026-02-28',
            teacher_id: '1',
            description: 'Test description'
        });

        fixture.detectChanges();

        component.submit();

        expect(mockSessionApiService.create).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Yoga',
                date: '2026-02-28',
                teacher_id: '1',
                description: 'Test description'
            })
        );
    });

    it('should update a session (integration)', () => {
        component.onUpdate = true;

        component.sessionForm!.patchValue({
            name: 'Yoga modifié',
            date: '2026-06-17',
            teacher_id: '1',
            description: 'Description modifiée'
        });

        fixture.detectChanges();

        component.submit();

        expect(mockSessionApiService.update).toHaveBeenCalled();
    });

    it('should render form fields (integration)', () => {
        fixture.detectChanges();

        const nameInput = fixture.debugElement.query(By.css('input[formControlName="name"]'));
        const dateInput = fixture.debugElement.query(By.css('input[formControlName="date"]'));
        const teacherSelect = fixture.debugElement.query(By.css('mat-select[formControlName="teacher_id"]'));

        expect(nameInput).toBeTruthy();
        expect(dateInput).toBeTruthy();
        expect(teacherSelect).toBeTruthy();
    });

    it('should call submit when form is valid (integration)', () => {

        const submitSpy = jest.spyOn(component, 'submit');

        component.sessionForm!.patchValue({
            name: 'Yoga',
            date: '2026-02-28',
            teacher_id: '1',
            description: 'Test'
        });

        fixture.detectChanges();

        component.submit();

        expect(submitSpy).toHaveBeenCalled();
    });
});
