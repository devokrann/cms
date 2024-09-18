"use client";

import React from "react";

import { ActionIcon, Affix, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

import { IconArrowUp } from "@tabler/icons-react";

export default function Top() {
	const [scroll, scrollTo] = useWindowScroll();

	return (
		<Affix position={{ bottom: "var(--mantine-spacing-xl)", right: "var(--mantine-spacing-xl)" }}>
			<Transition transition="slide-left" mounted={scroll.y > 0}>
				{transitionStyles => (
					<div style={transitionStyles}>
						<ActionIcon size={28} onClick={() => scrollTo({ y: 0 })}>
							<IconArrowUp size={20} />
						</ActionIcon>
					</div>
				)}
			</Transition>
		</Affix>
	);
}
