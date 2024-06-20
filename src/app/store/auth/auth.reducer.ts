// src/app/store/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { login, logout } from './auth.actions';

export interface AuthState {
    username: string | null;
    role: string | null;
}

export const initialState: AuthState = {
    username: null,
    role: null,
};

export const authReducer = createReducer(
    initialState,
    on(login, (state, { username, role }) => ({ ...state, username, role })),
    on(logout, state => ({ ...state, username: null, role: null }))
);
