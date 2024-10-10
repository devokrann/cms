"use client";

import { useEffect, useMemo, useState } from "react";

export const usePaginate = (list: any[], divisor: string) => {
	const [items, setItems] = useState<any[]>([]);
	const [activePage, setActivePage] = useState(1);

	// Memoize chunkedList so that it recalculates when 'list' or 'divisor' changes
	const chunkedList = useMemo(() => (list ? chunkUsers(list!, Number(divisor)) : []), [list, divisor]);

	// Memoize page range so that it recalculates when dependencies changes
	const pageRange = useMemo(() => {
		if (chunkedList.length > 0) {
			const lastChunkInView =
				chunkedList[chunkedList.length - 1].length == items.length &&
				chunkedList[chunkedList.length - 1].length != Number(divisor);

			return {
				from: lastChunkInView ? list.length - items.length + 1 : activePage * items.length - items.length + 1,
				to: lastChunkInView ? list.length : activePage * items.length,
			};
		} else {
			return null;
		}
	}, [chunkedList, activePage, list, divisor, items]);

	useEffect(() => {
		if (list) {
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
	}, [list, activePage, divisor, chunkedList]);

	return { items, setItems, activePage, setActivePage, chunkedList, pageRange };
};

const chunkUsers = (array: any[], size: number): any[][] => {
	if (!array.length) {
		return [];
	}

	const head = array.slice(0, size);
	const tail = array.slice(size);

	return [head, ...chunkUsers(tail, size)];
};
