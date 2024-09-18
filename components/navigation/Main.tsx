"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Anchor, Group } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

import MenuNavbar from "../menus/Navbar";

import links from "@/data/links";

import classes from "./Main.module.scss";

export default function Main() {
	const pathname = usePathname();

	return links.navbar.map(link => (
		<MenuNavbar key={link.link} subLinks={link.subLinks}>
			{!link.subLinks ? (
				<Anchor
					component={Link}
					underline="never"
					href={link.link}
					className={`${classes.link} ${pathname == link.link ? classes.linkActive : ""}`}
				>
					{link.label}
				</Anchor>
			) : (
				<Anchor
					component={Link}
					underline="never"
					href={link.link}
					className={`${classes.link} ${
						pathname == link.link || link.subLinks.find(l => l.link == pathname) ? classes.linkActive : ""
					}`}
					// onClick={e => e.preventDefault()}
				>
					<Group gap={4}>
						<span>{link.label}</span>
						<IconChevronDown size={16} stroke={1.5} style={{ marginTop: 2 }} />
					</Group>
				</Anchor>
			)}
		</MenuNavbar>
	));
}
