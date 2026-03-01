import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect, jest } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const authServiceMock: jest.Mocked<AuthService> = {
      register: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const routerMock: jest.Mocked<Router> = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register and navigate to /login on success', () => {
    authService.register.mockReturnValue(of(void 0));

    component.form.setValue({
      email: 'john@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'secret',
    });

    component.submit();

    expect(authService.register).toHaveBeenCalledWith({
      email: 'john@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'secret',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true in case of API error', () => {
    authService.register.mockReturnValue(
      throwError(() => new Error('API error')),
    );

    component.form.setValue({
      email: 'john@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'secret',
    });

    component.submit();

    expect(authService.register).toHaveBeenCalled();
    expect(component.onError).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
