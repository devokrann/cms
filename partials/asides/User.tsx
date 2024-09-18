"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import AvatarAside from "@/components/avatars/Aside";

import { Divider, NavLink, Stack, Title } from "@mantine/core";
import {
	IconBellRinging,
	IconChevronRight,
	IconCoins,
	IconHeart,
	IconHelpCircle,
	IconInfoCircle,
	IconLogout,
	IconMapPin,
	IconPackage,
	IconSettings,
	IconStar,
	IconUser,
} from "@tabler/icons-react";

import LayoutSection from "@/layouts/Section";

import { signOut } from "next-auth/react";

export default function User() {
	const pathname = usePathname();

	const navLinkItems = {
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
				link: `/help/terms-and-conditions`,
				label: "Terms and Conditions",
			},
		],
		danger: [
			{
				icon: IconLogout,
				link: `/api/auth/signout`,
				label: "Sign Out",
				color: "red.6",
			},
		],
	};

	return (
		<LayoutSection padded pos={"sticky"} top={0}>
			<Stack gap={48} align="center">
				<AvatarAside />

				<Stack w={"100%"}>
					{/* <Stack gap={"xs"}>
						<Title order={3} fz={"md"} ml={{ md: "sm" }}>
							Activity
						</Title>

						<Stack gap={4}>
							{navLinkItems.activity.map(item => (
								<NavLink
									key={item.label}
									component={Link}
									href={item.link}
									label={item.label}
									leftSection={<item.icon size={16} stroke={1.5} />}
									rightSection={<IconChevronRight size={16} />}
									active={item.link == pathname}
									style={{ borderRadius: "var(--mantine-radius-md)" }}
								/>
							))}
						</Stack>
					</Stack>

					<Divider /> */}

					<Stack gap={"xs"}>
						<Title order={3} fz={"md"} ml={{ md: "sm" }}>
							Account
						</Title>

						<Stack gap={4}>
							{navLinkItems.user.map(item => (
								<NavLink
									key={item.label}
									component={Link}
									href={item.link}
									label={item.label}
									leftSection={<item.icon size={16} stroke={1.5} />}
									rightSection={<IconChevronRight size={16} />}
									active={item.link == pathname}
									style={{ borderRadius: "var(--mantine-radius-md)" }}
								/>
							))}
						</Stack>
					</Stack>

					{/* <Divider />

					<Stack gap={"xs"}>
						<Title order={3} fz={"md"} ml={{ md: "sm" }}>
							Customer Care
						</Title>

						<Stack gap={4}>
							{navLinkItems.help.map(item => (
								<NavLink
									key={item.label}
									component={Link}
									href={item.link}
									label={item.label}
									leftSection={<item.icon size={16} stroke={1.5} />}
									rightSection={<IconChevronRight size={16} />}
									active={item.link == pathname}
									style={{ borderRadius: "var(--mantine-radius-md)" }}
								/>
							))}
						</Stack>
					</Stack> */}

					<Divider />

					<Stack gap={4}>
						{navLinkItems.danger.map(item => (
							<NavLink
								key={item.label}
								component={"a"}
								href={item.link}
								label={item.label}
								color={item.color}
								leftSection={<item.icon size={16} stroke={1.5} />}
								rightSection={<IconChevronRight size={16} />}
								style={{ borderRadius: "var(--mantine-radius-md)" }}
								active
							/>
						))}
					</Stack>
				</Stack>
			</Stack>
		</LayoutSection>
	);
}
