import React from "react";

import LayoutBody from "@/layouts/Body";

import { Metadata } from "next";
import contact from "@/data/contact";

export interface typeParams {
	userId: string;
}

export const metadata: Metadata = {
	title: { default: "Users", template: `%s - Users - Listings - ${contact.name.app}` },
};

export default function LayoutUsers({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody>{children}</LayoutBody>;
}
