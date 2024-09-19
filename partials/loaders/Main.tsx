"use client";

import { Loader, Overlay, Text, Transition } from "@mantine/core";
import React, { useEffect, useState } from "react";

import classes from "./Main.module.scss";

export default function Main() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setTimeout(() => setMounted(true), 7000);
	}, []);

	return (
		<Overlay fixed className={classes.overlay}>
			<Loader color="pri" type="dots" />

			<Transition mounted={mounted} transition="fade" duration={200} timingFunction="ease">
				{styles => (
					<div style={styles}>
						<Text inherit fz={"xs"} ta={"center"}>
							This is taking longer than expected
							<br />
							you might be on a slow network
						</Text>
					</div>
				)}
			</Transition>
		</Overlay>
	);
}
