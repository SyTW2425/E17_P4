import { NgClass, NgIf } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterModule,
        NgIf
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
    form: FormGroup;
    submitted = false;
    loading = false;
formGroup: any;

    constructor(private formBuilder: FormBuilder) {
        // Initialize the form with validators
        this.form = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]], // Must be a string
            lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]], // Must be a string
            email: ['', [Validators.required, Validators.email]], // Must be a valid email
            username: ['', Validators.required], // Required
            password: ['', [Validators.required, Validators.minLength(7)]], // Min length 7
            confirmPassword: ['', Validators.required], // Must match password
            role: ['', Validators.required] // Either 'Empleado' or 'Dueño'
        }, {
            validator: this.passwordMatchValidator // Custom validator for password match
        });
    }

    // Custom validator for matching passwords
    passwordMatchValidator(group: FormGroup) {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    // Getter for form controls
    get f() {
        return this.form.controls;
    }

    // Submit the form
    onSubmit() {
        this.submitted = true;

        // Stop if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        // Simulate an API call
        setTimeout(() => {
            this.loading = false;
            alert('User registered successfully!');
        }, 2000);
    }
}
