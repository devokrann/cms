"use client";

import React from "react";

import NextImage from "next/image";
import { usePathname } from "next/navigation";

import { Burger, Button, Drawer, Group, Image, NavLink, Stack } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import classes from "./Main.module.scss";

import { typeMenuNavbar } from "@/types/components/menu";

export default function Main({ data, ...restProps }: { data: typeMenuNavbar[] } & React.ComponentProps<typeof Burger>) {
	const [opened, { toggle, close }] = useDisclosure(false);
	const pathname = usePathname();
	const mobile = useMediaQuery("(max-width: 36em)");

	const navMobile = data.map(link => {
		const subLinks =
			link.subLinks &&
			link.subLinks.map(subLink => (
				<NavLink
					key={subLink.link}
					href={subLink.link}
					label={subLink.label}
					active={pathname == subLink.link}
					onClick={() => close()}
				/>
			));

		return !subLinks ? (
			<NavLink
				key={link.link}
				href={link.link}
				label={link.label}
				active={pathname == link.link}
				onClick={() => close()}
				leftSection={link.leftSection ? <link.leftSection size={14} /> : undefined}
				rightSection={link.rightSection ? <link.rightSection size={14} /> : undefined}
				fw={pathname == link.link ? 500 : undefined}
			/>
		) : (
			<NavLink
				key={link.link}
				href={link.link}
				label={link.label}
				active={pathname == link.link}
				opened={link.subLinks?.find(sl => sl.link == pathname)?.link == pathname ? true : undefined}
				leftSection={link.leftSection ? <link.leftSection size={14} /> : undefined}
				rightSection={link.rightSection ? <link.rightSection size={14} /> : undefined}
				fw={pathname == link.link ? 500 : undefined}
			>
				{subLinks}
			</NavLink>
		);
	});

	return (
		<>
			<Drawer
				opened={opened}
				onClose={close}
				withCloseButton={false}
				size={"200"}
				classNames={{
					body: classes.body,
					close: classes.close,
					content: classes.content,
					header: classes.header,
					inner: classes.inner,
					overlay: classes.overlay,
					root: classes.root,
					title: classes.title,
				}}
				// title={
				// 	<Group>
				// 		<Image
				// 			src={brand.logo.light}
				// alt={contact.name.app}
				// 			h={{ base: 24 }}
				// 			component={NextImage}
				// width={1920}
				// 				height={1080}
				// 			loading="lazy"
				// 		/>
				// 	</Group>
				// }
			>
				<Stack>
					<Stack gap={0}>{navMobile}</Stack>

					<Stack gap={"xs"} px={"xs"}>
						<Button size="xs" variant="default">
							Log In
						</Button>
						<Button size="xs">Get in Touch</Button>
					</Stack>
				</Stack>
			</Drawer>

			<Burger opened={opened} onClick={toggle} size={mobile ? "sm" : "sm"} {...restProps} />
		</>
	);
}
