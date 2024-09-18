import React from "react";

import { NativeSelect } from "@mantine/core";

export default function Blog() {
	return <NativeSelect size="xs" w={120} data={["Show 25", "Show 50", "Show 75", "Show 100"]} />;
}
