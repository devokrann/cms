import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import LayoutPage from "@/layouts/Page";
import FormAuthSignUp from "@/partials/forms/auth/SignUp";

import { auth } from "@/auth";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default async function SignUp() {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<FormAuthSignUp />
		</LayoutPage>
	);
}
