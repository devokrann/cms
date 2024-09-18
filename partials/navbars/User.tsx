"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Grid, GridCol, NavLink, Stack } from "@mantine/core";

import { IconBellRinging, IconSettings } from "@tabler/icons-react";
import { IconCoins, IconMapPin, IconUser } from "@tabler/icons-react";

import classes from "./User.module.scss";

export default function User() {
	// const { data: session } = useSession({ required: true });

	const pathname = usePathname();

	// const navLinkItems = [
	// 	{
	// 		icon: IconUser,
	// 		link: `/${session?.user.id}/settings/profile`,
	// 		label: "Profile",
	// 	},
	// 	{
	// 		icon: IconCoins,
	// 		link: `/${session?.user.id}/settings/payment`,
	// 		label: "Payment",
	// 	},
	// 	{
	// 		icon: IconMapPin,
	// 		link: `/${session?.user.id}/settings/addresses`,
	// 		label: "Addresses",
	// 	},
	// 	{
	// 		icon: IconSettings,
	// 		link: `/${session?.user.id}/settings/account`,
	// 		label: "Account",
	// 	},
	// 	{
	// 		icon: IconBellRinging,
	// 		link: `/${session?.user.id}/settings/notifications`,
	// 		label: "Notifications",
	// 	},
	// ];

	return (
		<Grid gutter={"xs"}>
			{/* {navLinkItems.map(item => (
				<GridCol key={item.label} span={{ base: 6, xs: 4, sm: 4 }}>
					<NavLink
						classNames={{ root: classes.root }}
						component={Link}
						href={item.link}
						label={item.label}
						leftSection={<item.icon size={16} />}
						active={item.link == pathname}
					/>
				</GridCol>
			))} */}
			<div>links</div>
		</Grid>
	);
}
