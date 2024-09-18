import React from "react";

import { Text } from "@mantine/core";

import LayoutSection from "@/layouts/Section";

import classes from "./Main.module.scss";
import contact from "@/data/contact";

export default function Main() {
	return (
		<LayoutSection padded="lg" className={classes.footer}>
			<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
				<Text component="span" inherit>
					© {new Date().getFullYear()} {contact.name.app}
				</Text>
				.{" "}
				<Text component="span" inherit>
					All Rights Reserved
				</Text>
			</Text>
		</LayoutSection>
	);
}
