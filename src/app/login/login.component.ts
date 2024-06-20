// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login } from '../store/auth/auth.actions';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private store: Store<AppState>) { }

  onSubmit() {
    if (this.username === 'admin' && this.password === 'admin') {
      this.store.dispatch(login({ username: this.username, role: 'admin' }));
      this.router.navigate(['/tareas']);
    } else if (this.username === 'user1' && this.password === 'user1'){
      this.store.dispatch(login({ username: this.username, role: 'user' }));
      this.router.navigate(['/tareas']);
    }else {
      alert('Usuario o contraseña incorrecta');
    }
  }
}
