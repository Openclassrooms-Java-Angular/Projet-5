import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from 'src/app/services/session.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';

describe('ListComponent Integration', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSessionApiService: any;
  let mockSessionService: any;

  beforeEach(async () => {
    mockSessionApiService = {
      all: jest.fn().mockReturnValue(of([
        { id: 1, name: 'Yoga Débutant' },
        { id: 2, name: 'Yoga Avancé' }
      ]))
    };

    mockSessionService = {
      sessionInformation: { id: 1, username: 'john', admin: true }
    };

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // déclenche ngOnInit
  });

  it('should load sessions from SessionApiService', (done) => {
    component.sessions$.subscribe(sessions => {
      expect(sessions.length).toBe(2);
      expect(sessions[0].name).toBe('Yoga Débutant');
      expect(mockSessionApiService.all).toHaveBeenCalled();
      done();
    });
  });

  it('should render session cards in the template', () => {
    fixture.detectChanges(); // Mise à jour du template

    const cards = fixture.debugElement.queryAll(By.css('.items.mt2 mat-card'));
    expect(cards.length).toBe(2);
    expect(cards[0].nativeElement.textContent).toContain('Yoga Débutant');
    expect(cards[1].nativeElement.textContent).toContain('Yoga Avancé');
  });

  it('should expose user information from SessionService', () => {
    expect(component.user).toEqual(mockSessionService.sessionInformation);
  });
});
