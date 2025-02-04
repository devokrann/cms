import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Group, Stack } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthSignIn from "@/partials/forms/auth/SignIn";

import Brand from "@/components/Brand";

import { auth } from "@/auth";
import Link from "next/link";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignIn() {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection padded containerized={"xs"}>
				<Stack gap={40}>
					<Group justify="center">
						<Link href={"/"}>
							<Brand height={32} />
						</Link>
					</Group>

					<FormAuthSignIn />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
