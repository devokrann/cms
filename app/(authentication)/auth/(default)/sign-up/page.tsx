import React from "react";

import { Metadata } from "next";
import NextImage from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Anchor, Center, Grid, GridCol, Group, Image, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthSignUp from "@/partials/forms/auth/SignUp";

import images from "@/assets/images";
import contact from "@/data/contact";

import { auth } from "@/auth";

// import TemplateEmailCodeSignUp from "@/templates/email/code/SignUp";

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
