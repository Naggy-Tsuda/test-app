'use client';

import { useActionState } from "react";
import { Box, Button, TextField } from "@mui/material";
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
    <>
      <h1 style={{ textAlign: "center", fontSize: "32px" }}>
        Login Form
      </h1>
      {loginState && <p style={{ color: 'red' }}>{loginState}</p>}
      {signupState && <p style={{ color: 'red' }}>{signupState}</p>}

      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300, margin: 'auto', mt: 4 }}
      >
        <TextField
          label="Email"
          name="email" // Required for Server Actions to read the value
          type="email"
          required
        />
        <TextField
          label="Password"
          name="password" // Required for Server Actions to read the value
          type="password"
          required
        /><br />
        <Button formAction={loginAction} type="submit" variant="contained" disabled={loginPending}>
          Log in
        </Button>
        <Button formAction={signupAction} type="submit" variant="outlined" disabled={signupPending}>
          Sign up
        </Button>
      </Box>
    </>
  );
}