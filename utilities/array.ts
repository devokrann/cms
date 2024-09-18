export const elementIsPresentInArray = (id: string, array: any[]) =>
	array.find(p => p.compoundId == id) ? true : false;

export const arraysAreEqual = (array1: any[], array2: any[]): boolean => {
	// If the lengths of the arrays are different, they are not equal
	if (array1.length !== array2.length) {
		return false;
	}

	// Sort both arrays by their 'id' property to ensure order doesn't affect the comparison
	const sortedArray1 = array1.sort((a, b) => a.id.localeCompare(b.id));
	const sortedArray2 = array2.sort((a, b) => a.id.localeCompare(b.id));

	// Compare each element in the sorted arrays
	for (let i = 0; i < sortedArray1.length; i++) {
		if (sortedArray1[i].id !== sortedArray2[i].id) {
			return false;
		}
	}

	return true;
};
