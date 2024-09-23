import React from "react";

import LayoutBody from "@/layouts/Body";

// import { Metadata } from "next";

// import { getUsers } from "@/handlers/database/users";

// import { typeUser } from "@/types/user";

// import { typeParams } from "../layout";

// export const generateMetadata = async ({ params }: { params: typeParams }): Promise<Metadata> => {
// 	const users: typeUser[] = await getUsers();
// 	const user = users.find(u => u.id == params.userId);

// 	return { title: `User ${user?.id}` };
// };

export default function LayoutUser({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody>{children}</LayoutBody>;
}
