"use client";

import React from "react";

import Link from "next/link";

import {
	Menu,
	MenuDivider,
	MenuDropdown,
	MenuItem,
	MenuLabel,
	MenuTarget,
	Avatar as MantineAvatar,
	Text,
	Stack,
	Skeleton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import {
	IconSettings,
	IconUser,
	IconLogout,
	IconPackage,
	IconCoins,
	IconMapPin,
	IconBellRinging,
	IconDashboard,
	IconHeart,
	IconStar,
	IconHelpCircle,
	IconInfoCircle,
} from "@tabler/icons-react";

import classes from "./Avatar.module.scss";

import { initialize } from "@/handlers/parsers/string";

import { useSession } from "next-auth/react";

export default function Avatar() {
	const session = useSession();

	const mobile = useMediaQuery("(max-width: 48em)");

	const sizeAvatar = mobile ? 28 : 36;

	const menuItems = {
		activity: [
			{
				icon: IconHeart,
				link: `/account/wishlist`,
				label: "My Wishlist",
			},
			{
				icon: IconPackage,
				link: `/account/orders`,
				label: "My Orders",
			},
			{
				icon: IconStar,
				link: `/account/reviews`,
				label: "My Reviews",
			},
		],
		user: [
			{
				icon: IconUser,
				link: `/account/profile`,
				label: "Profile Settings",
			},
			// {
			// 	icon: IconCoins,
			// 	link: `/account/payment`,
			// 	label: "Payment Details",
			// },
			// {
			// 	icon: IconMapPin,
			// 	link: `/account/addresses`,
			// 	label: "Addresses",
			// },
			{
				icon: IconBellRinging,
				link: `/account/notifications`,
				label: "Notifications",
			},
		],
		help: [
			{
				icon: IconHelpCircle,
				link: `/help`,
				label: "Help Center",
			},
			{
				icon: IconInfoCircle,
				link: `/legal/terms-and-conditions`,
				label: "Terms and Conditions",
			},
		],
		danger: [
			{
				icon: IconLogout,
				link: process.env.NEXT_PUBLIC_SIGN_OUT_URL!,
				label: "Sign Out",
				color: "red",
			},
		],
	};

	return (
		<Menu
			position={"bottom"}
			withArrow
			classNames={{ dropdown: classes.dropdown, item: classes.item, divider: classes.divider }}
			width={mobile ? 200 : 240}
		>
			<MenuTarget>
				{!session.data?.user.image ? (
					<MantineAvatar
						size={sizeAvatar}
						title={session.data?.user.name ? session.data?.user.name : "User"}
						className={classes.avatar}
					>
						{session.data?.user.name
							? initialize(session.data?.user.name)
							: session.data?.user.email?.charAt(0).toUpperCase()}
					</MantineAvatar>
				) : (
					<MantineAvatar
						src={session.data?.user.image}
						alt={session.data?.user.name ? session.data?.user.name : "User"}
						size={sizeAvatar}
						title={session.data?.user.name ? session.data?.user.name : "User"}
						className={classes.avatar}
					/>
				)}
			</MenuTarget>

			<MenuDropdown>
				<Stack gap={"xs"} align="center" p={"sm"}>
					{session.status == "loading" ? (
						<Skeleton height={8} radius="xl" />
					) : (
						session.data && (
							<Stack gap={"xs"}>
								{session.data?.user.name && (
									<Text fz={"sm"} lh={1} ta={"center"}>
										{session.data?.user.name}
									</Text>
								)}
								<Text fz={"xs"} lh={1} ta={"center"}>
									({session.data?.user.email})
								</Text>

								{/* <Text fz={"xs"} lh={1} ta={"center"}>
									({session.data?.expires})
								</Text> */}
							</Stack>
						)
					)}
				</Stack>

				{session.data && <MenuDivider />}

				{/* <MenuLabel>Activity</MenuLabel>
				{menuItems.activity.map(item => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))}

				<MenuDivider /> */}

				<MenuLabel>Account</MenuLabel>
				{menuItems.user.map(item => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))}

				{/* <MenuDivider />

				<MenuLabel>Customer Care</MenuLabel>
				{menuItems.help.map(item => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))} */}

				<MenuDivider />

				{menuItems.danger.map(item => (
					<MenuItem
						key={item.label}
						leftSection={<item.icon size={16} />}
						component={Link}
						href={item.link}
						color={item.color}
					>
						{item.label}
					</MenuItem>
				))}
			</MenuDropdown>
		</Menu>
	);
}
