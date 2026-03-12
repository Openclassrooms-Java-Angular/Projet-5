import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { AuthService } from "../../services/auth.service";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { expect } from '@jest/globals';
import { of, throwError } from "rxjs";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";

describe('LoginComponent (integration)', () => {

    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let authService: AuthService;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                ReactiveFormsModule,
                HttpClientTestingModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                MatIconModule,
                BrowserAnimationsModule
            ],
            providers: [AuthService]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService);

        fixture.detectChanges();
    });

    it('should call login service', () => {

        jest.spyOn(authService, 'login').mockReturnValue(of({
            token: 'fake-token',
            type: 'Bearer',
            id: 1,
            username: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            admin: false
        }));

        component.form.setValue({
            email: 'test@test.com',
            password: 'password'
        });

        component.submit();

        expect(authService.login).toHaveBeenCalled();
    });

    it('should display error message on failed login', () => {
        // Mock du service pour renvoyer une erreur HTTP 401
        jest.spyOn(authService, 'login').mockReturnValue(
            throwError(() => ({ status: 401 }))
        );

        // Remplir le formulaire (si tu as form controls)
        component.form.setValue({ email: 'john@invalid.com', password: '1234' });

        // Appel de la méthode login du composant
        component.submit();

        fixture.detectChanges(); // Mise à jour du template

        // Vérifier que le message d'erreur est affiché
        const errorEl = fixture.debugElement.query(By.css('p.error'));
        expect(errorEl).toBeTruthy();
        expect(errorEl.nativeElement.textContent).toContain('An error occurred');
    });
});