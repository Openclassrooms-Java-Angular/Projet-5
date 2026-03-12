import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { Session } from '../../interfaces/session.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('DetailComponent (integration)', () => {
    let component: DetailComponent;
    let fixture: ComponentFixture<DetailComponent>;
    let sessionApiService: jest.Mocked<SessionApiService>;
    let sessionService: SessionService;

    // Mock SessionService avec session connectée
    const mockSessionService: Partial<SessionService> = {
        sessionInformation: {
            id: 1,
            username: 'john',
            firstName: 'John',
            lastName: 'Doe',
            token: 'fake-token',
            type: 'Bearer',
            admin: false
        } as SessionInformation
    };

    const mockSessionApiService: Partial<jest.Mocked<SessionApiService>> = {
        detail: jest.fn(),
        participate: jest.fn(),
        unParticipate: jest.fn(),
        delete: jest.fn()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientModule,
                MatSnackBarModule,
                ReactiveFormsModule,
                MatCardModule,
                MatIconModule,
            ],
            declarations: [DetailComponent],
            providers: [
                { provide: SessionService, useValue: mockSessionService },
                { provide: SessionApiService, useValue: mockSessionApiService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DetailComponent);
        component = fixture.componentInstance;

        sessionService = TestBed.inject(SessionService);
        sessionApiService = TestBed.inject(SessionApiService) as jest.Mocked<SessionApiService>;

        // Session par défaut pour le template
        sessionApiService.detail.mockReturnValue(of({
            id: 1,
            name: 'Yoga',
            description: 'Test session',
            date: new Date(),
            teacher_id: 1,
            users: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Session));

        fixture.detectChanges();
    });

    it('should render session details in template', () => {
        component.sessionId = '1';
        component.userId = '1';

        component.session = {
            id: 2,
            date: new Date(),
            name: 'Yoga',
            description: 'Test session',
            teacher_id: 1,
            users: []
        };
        fixture.detectChanges();

        // sélection des éléments
        const titleEl = fixture.debugElement.query(By.css('mat-card-title.mat-card-title'));
        const descEl = fixture.debugElement.query(By.css('.description'));

        expect(titleEl.nativeElement.textContent).toContain('Yoga');
        expect(descEl.nativeElement.textContent).toContain('Test session');
    });

    it('should call participate() and update template when user participates', () => {

        component.sessionId = '1';
        component.userId = '1';

        sessionApiService.participate.mockReturnValue(of(void 0));

        // backend response BEFORE participate
        sessionApiService.detail.mockReturnValue(of({
            id: 1,
            name: 'Yoga',
            description: 'Test session',
            date: new Date(),
            teacher_id: 1,
            users: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Session));

        fixture.detectChanges();

        const participateButton = fixture.debugElement
            .queryAll(By.css('button'))
            .find(btn => btn.nativeElement.textContent.includes('person_add'));

        expect(participateButton).toBeTruthy();

        participateButton!.triggerEventHandler('click', null);

        expect(sessionApiService.participate)
            .toHaveBeenCalledWith(component.sessionId, component.userId);

        sessionApiService.detail.mockReturnValue(of({
            id: 1,
            name: 'Yoga',
            description: 'Test session',
            date: new Date(),
            teacher_id: 1,
            users: [1],
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Session));

        component['fetchSession']();
        fixture.detectChanges();

        const updatedButton = fixture.debugElement
            .queryAll(By.css('button'))
            .find(btn => btn.nativeElement.textContent.includes('person_remove'));

        expect(updatedButton).toBeTruthy();
    });

    it('should call unParticipate() and update template when user unparticipates', () => {
        component.sessionId = '1';
        component.userId = '1';

        sessionApiService.unParticipate.mockReturnValue(of(void 0));

        // réponse du backend AVANT unParticipate
        sessionApiService.detail.mockReturnValue(of({
            id: 1,
            name: 'Yoga',
            description: 'Test session',
            date: new Date(),
            teacher_id: 1,
            users: [Number(component.userId)], // utilisateur inscrit
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Session));

        component['fetchSession']();    // met à jour component.session
        fixture.detectChanges();        // met à jour le template

        const unParticipateButton = fixture.debugElement
            .queryAll(By.css('button'))
            .find(btn => btn.nativeElement.textContent.includes('person_remove'));

        expect(unParticipateButton).toBeTruthy(); // bouton présent

        // Clique sur le bouton
        unParticipateButton!.triggerEventHandler('click', null);

        expect(sessionApiService.unParticipate).toHaveBeenCalledWith(component.sessionId, component.userId);

        // réponse du backend APRÈS unParticipate
        sessionApiService.detail.mockReturnValue(of({
            id: 1,
            name: 'Yoga',
            description: 'Test session',
            date: new Date(),
            teacher_id: 1,
            users: [], // utilisateur retiré
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Session));

        component['fetchSession']();
        fixture.detectChanges();

        const updatedButton = fixture.debugElement
            .queryAll(By.css('button'))
            .find(btn => btn.nativeElement.textContent.includes('person_add'));

        expect(updatedButton).toBeTruthy(); // bouton de nouveau "Participate"
    });

    it('should call delete() and show snackbar', () => {
        sessionApiService.delete.mockReturnValue(of(void 0));
        const snackSpy = jest.spyOn(component['matSnackBar'], 'open');

        component.delete();
        fixture.detectChanges();

        expect(sessionApiService.delete).toHaveBeenCalledWith(component.sessionId);
        expect(snackSpy).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    });
});
