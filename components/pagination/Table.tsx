import { UserGet } from "@/types/model/user";
import { Pagination } from "@mantine/core";
import React from "react";

export default function Table({
	users,
	divisor,
	activePage,
	setActivePage,
}: {
	users: UserGet[];
	divisor: string;
	activePage: number;
	setActivePage: any;
}) {
	return (
		<Pagination
			size={"sm"}
			total={Math.ceil(users.length / Number(divisor))}
			value={activePage}
			onChange={setActivePage}
			defaultValue={1}
		/>
	);
}
