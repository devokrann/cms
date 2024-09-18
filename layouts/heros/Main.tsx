"use client";

import React from "react";

import { usePathname } from "next/navigation";

import PartialHeroHome from "@/partials/heros/Home";
import PartialHeroRoute from "@/partials/heros/Route";

import classes from "./Main.module.scss";
import { crumbify } from "@/handlers/parsers/string";

export default function Route({ title }: { title?: string }) {
	const pathname = usePathname();
	const segments = crumbify(pathname);

	// <Box component="section" className={classes.hero}>
	// 		<Container size="responsive">
	// 			<Group align="center" justify="space-between">
	// 				<BreadcrumbHero data={segments} />
	// 				<Title order={1} fw={500} fz={24}>
	// 					{title ? title : segments[segments.length - 1].label}
	// 				</Title>
	// 			</Group>
	// 		</Container>
	// 	</Box>

	return pathname == "/" ? <PartialHeroHome /> : <PartialHeroRoute />;
}
