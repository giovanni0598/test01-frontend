// src/app/store/auth/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const login = createAction(
    '[Auth] Login',
    props<{ username: string, role: string }>()
);

export const logout = createAction('[Auth] Logout');
