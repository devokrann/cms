/*

========== sample argument ==========
new Date(2023, 9, 14, 23, 59, 59)

========== sample usage ==========

const [time, setTime] = useState(countdown());

useEffect(() => {
	const interval = setInterval(() => {
		setTime(countdown());
	}, 1000);

	return () => clearInterval(interval);
}, []);

*/

export default function getRemainingTime(targetDate: Date) {
	const now = new Date();
	const timeDifference = Math.max(targetDate.getTime() - now.getTime(), 0);

	if (timeDifference > 0) {
		const seconds = Math.floor((timeDifference / 1000) % 60);
		const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
		const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
		const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

		let remainingDays = days;
		let months = 0;

		while (remainingDays >= 30) {
			const targetMonthDays = new Date(targetDate.getFullYear(), targetDate.getMonth() + months + 1, 0).getDate();
			if (remainingDays >= targetMonthDays) {
				remainingDays -= targetMonthDays;
				months++;
			} else {
				break;
			}
		}

		return {
			months,
			days: remainingDays,
			hours,
			minutes,
			seconds,
		};
	} else {
		return {
			months: 0,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		};
	}
}
