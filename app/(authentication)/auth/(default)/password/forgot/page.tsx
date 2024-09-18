import React from "react";

import NextImage from "next/image";
import { Metadata } from "next";
import Link from "next/link";

import { Anchor, Center, Grid, GridCol, Group, Image, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthPasswordForgot from "@/partials/forms/auth/password/Forgot";
import AuthHeader from "@/partials/auth/Header";

import images from "@/assets/images";
import contact from "@/data/contact";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Forgot Password" };

export default async function Forgot() {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection padded containerized={"xs"}>
				<Stack gap={40} px={{ md: 40 }}>
					<AuthHeader
						data={{
							title: "Enter Your Email",
							desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ut laoreet velit ma.",
						}}
					/>

					<FormAuthPasswordForgot />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
