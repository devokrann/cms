import React from "react";

import LayoutBody from "@/layouts/Body";

import { Metadata } from "next";
import contact from "@/data/contact";

export const metadata: Metadata = { title: { default: `Dashboard`, template: `%s - Create - ${contact.name.app}` } };

export default function LayoutDashboard({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody>{children}</LayoutBody>;
}
