import { Select } from "@mantine/core";
import React from "react";

export default function Divisor({
	divisors,
	divisor,
	setDivisor,
}: {
	divisors: number[];
	divisor: any;
	setDivisor: any;
}) {
	return (
		<Select
			size="xs"
			w={120}
			defaultValue={divisors[0].toString()}
			data={divisors.map(o => {
				return { value: o.toString(), label: `Show ${o}` };
			})}
			value={divisor}
			onChange={setDivisor}
			allowDeselect={false}
			withCheckIcon={false}
		/>
	);
}
