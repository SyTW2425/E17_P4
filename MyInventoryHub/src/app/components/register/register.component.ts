import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { first } from 'rxjs';

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
      // Initialize the form
      this.form = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }
  
    get f() {
      return this.form.controls;
    }
  
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