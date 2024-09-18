import React from "react";

import { Accordion, AccordionControl, AccordionItem, AccordionPanel } from "@mantine/core";

import faqs from "@/data/faq";

import classes from "./Faq.module.scss";

export default function Faq() {
	const items = faqs.map(item => (
		<AccordionItem key={item.q} value={item.q} mt={faqs.indexOf(item) == 0 ? undefined : "md"}>
			<AccordionControl>{item.q}</AccordionControl>
			<AccordionPanel>{item.a}</AccordionPanel>
		</AccordionItem>
	));

	return (
		<Accordion
			defaultValue={faqs[0].q}
			classNames={{
				item: classes.item,
				label: classes.label,
				chevron: classes.chevron,
				control: classes.control,
			}}
		>
			{items}
		</Accordion>
	);
}
