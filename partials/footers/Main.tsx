import React from "react";

import { Text } from "@mantine/core";

import LayoutSection from "@/layouts/Section";

import contact from "@/data/contact";

export default function Main() {
	return (
		<LayoutSection padded="md" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
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
