"use client";

import React, { useState } from "react";

import { ActionIcon, Container, Group, Text, Transition } from "@mantine/core";

import { IconX } from "@tabler/icons-react";

import LayoutSection from "@/layouts/Section";

import classes from "./Main.module.scss";

export default function Main() {
	const [visible, setVisible] = useState(true);

	return (
		<Transition transition="slide-down" mounted={visible}>
			{transitionStyles => (
				<LayoutSection style={transitionStyles} className={classes.bar} shadowed>
					<Container size={"responsive"} pos={"relative"}>
						<Group justify="center" w={{ base: "80%", sm: "100%" }}>
							<Text fz={{ base: "xs", lg: "sm" }}>
								Don&apos;t miss out on amazing deals! Join our newsletter to receive a 10% OFF code.
							</Text>

							<ActionIcon
								size={24}
								variant="subtle"
								className={classes.close}
								onClick={() => setVisible(false)}
							>
								<IconX size={16} stroke={1.5} />
							</ActionIcon>
						</Group>
					</Container>
				</LayoutSection>
			)}
		</Transition>
	);
}
