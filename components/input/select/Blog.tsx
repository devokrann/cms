import React from "react";

import { NativeSelect, Select } from "@mantine/core";

export default function Blog() {
	const data = ["Show 25", "Show 50", "Show 75", "Show 100"];

	return <Select size="xs" w={120} placeholder={data[0]} data={data} />;
}
