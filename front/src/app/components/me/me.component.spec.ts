import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import { expect, jest } from '@jest/globals';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockUserService: any;
  let mockSnackBar: any;
  let mockRouter: any;
  let mockSessionService: any;

  beforeEach(async () => {

    mockUserService = {
      getById: jest.fn().mockReturnValue(of({
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: true,
        password: 'mockpass',
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      delete: jest.fn().mockReturnValue(of(null))
    };


    mockSnackBar = { open: jest.fn() };

    mockRouter = { navigate: jest.fn() };

    mockSessionService = {
      sessionInformation: {
        admin: true,
        id: 1
      },
      logOut: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on ngOnInit', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
      password: 'mockpass',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUserService.getById.mockReturnValue(of(mockUser));

    component.ngOnInit();

    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('should call window.history.back', () => {
    const spy = jest.spyOn(window.history, 'back').mockImplementation(() => { });
    component.back();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore()
  });

  it('should delete user and perform all side effects', () => {
    mockUserService.delete.mockReturnValue(of(null));

    component.delete();

    expect(mockUserService.delete).toHaveBeenCalledWith('1');
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
