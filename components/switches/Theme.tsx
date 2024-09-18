import React from "react";

import { Switch, useMantineColorScheme, useComputedColorScheme } from "@mantine/core";

import { IconMoonStars, IconSun } from "@tabler/icons-react";

export default function Theme() {
	const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });
	const { colorScheme, setColorScheme } = useMantineColorScheme({ keepTransitions: true });

	return (
		<Switch
			radius={"sm"}
			defaultChecked={colorScheme == "dark" ? true : false}
			offLabel={<IconMoonStars size={16} stroke={2.5} />}
			onLabel={<IconSun size={16} stroke={2.5} />}
			onChange={() => setColorScheme(computedColorScheme == "dark" ? "light" : "dark")}
		/>
	);
}
