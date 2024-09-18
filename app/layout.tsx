import React from "react";

import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";

import "@mantine/core/styles/global.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/tiptap/styles.css";

import "@/styles/global.scss";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import { SpeedInsights } from "@vercel/speed-insights/next";

import projectName from "@/theme";

import contact from "@/data/contact";

import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";

import AffixTheme from "@/components/affixi/Theme";

const noto = Noto_Sans_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: { default: `${contact.name.app}`, template: `%s - ${contact.name.app}` },
	description: "App description",
};

export default async function App({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// obtain sessioin
	const session = await auth();

	return (
		<html lang="en" data-mantine-color-scheme="light">
			<head>
				<ColorSchemeScript defaultColorScheme="light" />
			</head>
			<body className={noto.className}>
				<MantineProvider
					theme={projectName}
					defaultColorScheme="light"
					classNamesPrefix="next-template"
					withStaticClasses={false}
					withGlobalClasses={true}
				>
					<ModalsProvider>
						<SessionProvider session={session}>{children}</SessionProvider>
					</ModalsProvider>

					<Notifications limit={3} />
					<AffixTheme />
				</MantineProvider>

				<SpeedInsights />
			</body>
		</html>
	);
}
