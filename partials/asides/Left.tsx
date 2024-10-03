"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LayoutSection from "@/layouts/Section";
import { NavLink, Stack, Title } from "@mantine/core";
import { IconBlockquote, IconDashboard, IconTextPlus, IconUser, IconUserPlus } from "@tabler/icons-react";

export default function Left() {
	const pathname = usePathname();

	return (
		<LayoutSection my={"md"}>
			<Stack>
				<Stack gap={"xs"}>
					<Title order={2} fz={"md"}>
						Quick Links
					</Title>

					<Stack gap={2}>
						{links.quick.map(i => (
							<NavLink
								key={i.link}
								label={i.label}
								leftSection={<i.icon size={16} stroke={1.5} />}
								active={pathname == i.link}
								component={Link}
								href={i.link}
								style={{ borderRadius: "var(--mantine-radius-sm)" }}
							/>
						))}
					</Stack>
				</Stack>

				<Stack gap={"xs"}>
					<Title order={2} fz={"md"}>
						Listings
					</Title>

					<Stack gap={4}>
						{links.listings.map(i => (
							<NavLink
								key={i.link}
								label={i.label}
								leftSection={<i.icon size={16} stroke={1.5} />}
								active={pathname == i.link}
								component={Link}
								href={i.link}
								style={{ borderRadius: "var(--mantine-radius-sm)" }}
							/>
						))}
					</Stack>
				</Stack>

				<Stack gap={"xs"}>
					<Title order={2} fz={"md"}>
						Create
					</Title>

					<Stack gap={4}>
						{links.create.map(i => (
							<NavLink
								key={i.link}
								label={i.label}
								leftSection={<i.icon size={16} stroke={1.5} />}
								active={pathname == i.link}
								component={Link}
								href={i.link}
								style={{ borderRadius: "var(--mantine-radius-sm)" }}
							/>
						))}
					</Stack>
				</Stack>
			</Stack>
		</LayoutSection>
	);
}

export const links = {
	quick: [{ link: "/", label: "Overview", icon: IconDashboard }],
	listings: [
		{ link: "/listings/users", label: "Users", icon: IconUser },
		{ link: "/listings/posts", label: "Blog Posts", icon: IconBlockquote },
	],
	create: [
		{ link: "/create/user", label: "User", icon: IconUserPlus },
		{ link: "/create/post", label: "Blog Post", icon: IconTextPlus },
	],
};
