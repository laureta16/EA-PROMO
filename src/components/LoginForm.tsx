"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="card p-6 max-w-sm mx-auto space-y-4">
      <h2 className="text-xl font-bold">Hyr në Admin</h2>
      <div className="field">
        <label htmlFor="password">Fjalëkalimi</label>
        <input id="password" name="password" type="password" required className="input" autoFocus />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Po hyhet..." : "Hyr"}
      </button>
    </form>
  );
}
