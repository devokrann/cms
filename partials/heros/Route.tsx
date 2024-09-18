"use client";

import React from "react";

import { usePathname } from "next/navigation";

import BreadcrumbMain from "@/components/breadcrumbs/Main";
import { crumbify } from "@/handlers/parsers/string";

export default function Route() {
	const pathname = usePathname();
	const segments = crumbify(pathname);

	return <BreadcrumbMain data={segments} />;
}
