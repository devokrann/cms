import { Pagination } from "@mantine/core";
import React from "react";

export default function Table({
	list,
	divisor,
	activePage,
	setActivePage,
}: {
	list: any[];
	divisor: string;
	activePage: number;
	setActivePage: any;
}) {
	return (
		<Pagination
			size={"sm"}
			total={Math.ceil(list.length / Number(divisor))}
			value={activePage}
			onChange={setActivePage}
			defaultValue={1}
		/>
	);
}
