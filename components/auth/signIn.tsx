"use client";

import React from "react";

import { signIn } from "next-auth/react";

export default function AuthSignIn({ children }: { children: React.ReactNode }) {
	return <div onClick={async () => await signIn()}>{children}</div>;
}
