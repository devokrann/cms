"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LayoutSection from "@/layouts/Section";
import { NavLink, Stack } from "@mantine/core";
import { IconBlockquote, IconDashboard, IconUser } from "@tabler/icons-react";

export default function Left() {
	const pathname = usePathname();

	return (
		<LayoutSection padded="md" pos={"sticky"} top={0}>
			<Stack gap={4}>
				{links.map(i => (
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
		</LayoutSection>
	);
}

export const links = [
	{ link: "/", label: "Overview", icon: IconDashboard },
	{ link: "/users", label: "Users", icon: IconUser },
	{ link: "/blog", label: "Blog Posts", icon: IconBlockquote },
];
