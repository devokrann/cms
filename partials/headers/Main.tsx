import React from "react";

import { Anchor, Button, Grid, GridCol, Group, Stack } from "@mantine/core";

import LayoutSection from "@/layouts/Section";
import Brand from "@/components/Brand";
import InputSearchHeader from "@/components/input/search/Header";
import MenuAvatar from "@/components/menus/Avatar";
import { auth } from "@/auth";
import AuthSignIn from "@/components/auth/signIn";
import Link from "next/link";

export default async function Main() {
	const session = await auth();

	return (
		<LayoutSection bordered padded="md" px={"md"}>
			<Grid gutter={0} align="center">
				<GridCol span={{ base: 12, md: 4 }}>
					<Stack align="start">
						<Link href={"/"}>
							<Brand />
						</Link>
					</Stack>
				</GridCol>

				<GridCol span={{ base: 12, md: 4 }}>
					<InputSearchHeader />
				</GridCol>

				<GridCol span={{ base: 12, md: 4 }}>
					<Group justify="end">
						{!session ? (
							<AuthSignIn>
								<Button size="xs">Sign In</Button>
							</AuthSignIn>
						) : (
							<MenuAvatar />
						)}
					</Group>
				</GridCol>
			</Grid>
		</LayoutSection>
	);
}
