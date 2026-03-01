import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call sessionService.logOut and navigate to "/"', () => {
    const mockSessionService = {
      logOut: jest.fn()
    } as unknown as SessionService;

    const mockRouter = {
      navigate: jest.fn()
    } as unknown as Router;

    const fixture = TestBed.overrideProvider(SessionService, { useValue: mockSessionService })
      .overrideProvider(Router, { useValue: mockRouter })
      .createComponent(AppComponent);

    const app = fixture.componentInstance;
    app.logout();

    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should return the Observable of sessionService.$isLogged', () => {
    const mockSessionService = {
      $isLogged: jest.fn().mockReturnValue(of(true))
    } as unknown as SessionService;

    const fixture = TestBed.overrideProvider(SessionService, { useValue: mockSessionService }).createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.$isLogged().subscribe(value => {
      expect(value).toBe(true);
    });

    expect(mockSessionService.$isLogged).toHaveBeenCalled();
  });
});
