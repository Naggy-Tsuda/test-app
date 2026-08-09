'use client';

import { useActionState } from "react";
import { Button } from "@mui/material";
import { login, signup } from "./actions";

const initialState: string | null = null;

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState(
    login,
    initialState,
  );
  const [signupState, signupAction, signupPending] = useActionState(
    signup,
    initialState,
  );

  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <br />
      {loginState && <p style={{ color: 'red' }}>{loginState}</p>}
      {signupState && <p style={{ color: 'red' }}>{signupState}</p>}
      <Button formAction={loginAction} disabled={loginPending}>
        Log in
      </Button>
      <Button formAction={signupAction} disabled={signupPending}>
        Sign up
      </Button>
    </form>
  );
}