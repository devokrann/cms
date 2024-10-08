"use client";

import { useEffect, useState } from "react";

export const usePaginate = (list: any[], divisor: string) => {
	const [items, setItems] = useState<any[]>([]);
	const [activePage, setActivePage] = useState(1);

	useEffect(() => {
		if (list) {
			const chunkedList = chunkUsers(list!, Number(divisor));

			if (chunkedList[activePage - 1]) {
				setItems(chunkedList[activePage - 1].map(item => item));
			} else {
				if (activePage > 1) {
					setActivePage(activePage - 1);
				} else {
					setItems([]);
				}
			}
		}
	}, [list, activePage, divisor]);

	return { items, setItems, activePage, setActivePage };
};

const chunkUsers = (array: any[], size: number): any[][] => {
	if (!array.length) {
		return [];
	}

	const head = array.slice(0, size);
	const tail = array.slice(size);

	return [head, ...chunkUsers(tail, size)];
};
