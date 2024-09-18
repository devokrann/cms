import React from "react";

import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export default function Blog() {
	return (
		<TextInput
			size="xs"
			leftSection={<IconSearch size={16} stroke={1.5} />}
			placeholder="Search blog"
			styles={{
				input: { paddingLeft: "var(--mantine-spacing-xl)" },
			}}
		/>
	);
}
