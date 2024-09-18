"use client";

import React, { useState } from "react";

import { MantineTransition, Transition } from "@mantine/core";
import { useInViewport } from "@mantine/hooks";

export default function Viewport({
	transition,
	children,
}: {
	transition?: MantineTransition | undefined;
	children: React.ReactNode;
}) {
	const { ref, inViewport } = useInViewport();
	const [mounted, setMounted] = useState(inViewport);

	setTimeout(() => setMounted(true), 500);

	return (
		<Transition
			mounted={mounted}
			transition={transition ? transition : "fade"}
			duration={250}
			timingFunction="ease"
		>
			{styles => (
				<div style={styles} ref={ref}>
					{children}
				</div>
			)}
		</Transition>
	);
}
