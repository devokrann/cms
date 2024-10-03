"use client";

import React from "react";

import {
	AppShell,
	AppShellFooter,
	AppShellHeader,
	AppShellMain,
	AppShellNavbar,
	AppShellSection,
	Burger,
	Group,
	ScrollArea,
	Skeleton,
	Stack,
} from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";

import HeaderMain from "@/partials/headers/Main";
import AsideLeft from "@/partials/asides/Left";
import FooterMain from "@/partials/footers/Main";

export default function Shell({ children }: { children: React.ReactNode }) {
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

	const pinned = useHeadroom({ fixedAt: 120000 });

	return (
		<AppShell
			layout="default"
			header={{ height: { base: 60 }, collapsed: !pinned }}
			navbar={{
				width: { sm: 280 },
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
			}}
			// footer={{ height: { base: 40 } }}
		>
			<AppShellHeader px={"md"}>
				<Stack justify="center" h={"100%"}>
					<HeaderMain
						mobileOpened={mobileOpened}
						toggleMobile={toggleMobile}
						desktopOpened={desktopOpened}
						toggleDesktop={toggleDesktop}
					/>
				</Stack>
			</AppShellHeader>

			<AppShellNavbar>
				<AppShellSection grow px={"md"} component={ScrollArea}>
					<AsideLeft />
				</AppShellSection>

				<AppShellSection bg={"var(--mantine-color-gray-light)"}>Navbar footer</AppShellSection>
			</AppShellNavbar>

			<AppShellMain>{children}</AppShellMain>

			{/* <AppShellFooter>
				<Stack justify="center" h={"100%"}>
					<FooterMain />
				</Stack>
			</AppShellFooter> */}
		</AppShell>
	);
}
