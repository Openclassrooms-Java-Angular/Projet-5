import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: jest.Mocked<AuthService>;
  let sessionService: jest.Mocked<SessionService>;
  let router: jest.Mocked<Router>;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const sessionServiceMock = {
      logIn: jest.fn(),
    } as unknown as jest.Mocked<SessionService>;

    const routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    sessionService = TestBed.inject(SessionService) as jest.Mocked<SessionService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login with form values and navigate on success', () => {
    const mockResponse: SessionInformation = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'test',
      firstName: 'Test',
      lastName: 'User',
      admin: false,
    };

    authService.login.mockReturnValue(of(mockResponse));

    component.form.setValue({
      email: 'test@yoga.com',
      password: 'secret',
    });

    component.submit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@yoga.com',
      password: 'secret',
    });
    expect(sessionService.logIn).toHaveBeenCalledWith(mockResponse);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true in case of error', () => {
    authService.login.mockReturnValue(throwError(() => new Error('Bad credentials')));

    component.form.setValue({
      email: 'test@yoga.com',
      password: 'mauvais-mot-de-passe',
    });

    component.submit();

    expect(authService.login).toHaveBeenCalled();
    expect(component.onError).toBe(true);
    expect(sessionService.logIn).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
