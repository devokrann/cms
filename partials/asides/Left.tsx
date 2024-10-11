"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LayoutSection from "@/layouts/Section";
import { NavLink, Stack } from "@mantine/core";
import {
	IconBlockquote,
	IconDashboard,
	IconLayoutDashboard,
	IconTextPlus,
	IconUser,
	IconUserPlus,
} from "@tabler/icons-react";

export default function Left() {
	const pathname = usePathname();

	const items = links.map(item => {
		const subLinks = item.subLinks.map(subLink => (
			<NavLink
				key={subLink.link}
				label={subLink.label}
				leftSection={<subLink.icon size={16} stroke={1.5} />}
				active={pathname == subLink.link}
				component={Link}
				href={subLink.link}
				style={{ borderRadius: "var(--mantine-radius-sm)" }}
			/>
		));

		return subLinks.length < 1 ? (
			<NavLink
				key={item.link}
				label={item.label}
				leftSection={<item.icon size={16} stroke={1.5} />}
				active={pathname == item.link}
				component={Link}
				href={item.link}
				style={{ borderRadius: "var(--mantine-radius-sm)" }}
			/>
		) : (
			<NavLink
				key={item.link}
				label={item.label}
				leftSection={<item.icon size={16} stroke={1.5} />}
				active={pathname == item.link || pathname.includes(item.link)}
				opened={true}
				component={Link}
				href={item.link}
				style={{ borderRadius: "var(--mantine-radius-sm)" }}
				// childrenOffset={28}
			>
				<Stack gap={4}>{subLinks}</Stack>
			</NavLink>
		);
	});

	return (
		<LayoutSection my={"md"}>
			<Stack gap={4}>{items}</Stack>
		</LayoutSection>
	);
}

export const links = [
	{ link: "/", label: "Overview", icon: IconDashboard, subLinks: [] },

	{
		link: "/users",
		label: "Users",
		icon: IconUser,
		subLinks: [
			{ link: "/users", label: "Overview", icon: IconLayoutDashboard },
			{ link: "/users/create", label: "Create User", icon: IconUserPlus },
		],
	},
	{
		link: "/posts",
		label: "Posts",
		icon: IconBlockquote,
		subLinks: [
			{ link: "/posts", label: "Overview", icon: IconLayoutDashboard },
			{ link: "/posts/create", label: "Create Post", icon: IconTextPlus },
		],
	},
];
