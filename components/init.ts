import fetchCandleEngine from "./fetchCandleEngine";
import fetchCandleEngine1hr from "./fetchCandleEngine1hr";
import pairs from "./pairs";
import setIntervalFromNow from "./setIntervalFromNow";

const init: any = () => {
	let ranOnce = false;
	let ranOnce1Week = false;

	const timerArray: any = [];

	const init1Day: any = async () => {
		console.log(`inside INIT func at ${new Date()}`);
			await fetchCandleEngine("day");
			for (const exchange of Object.keys(pairs)) {
				// console.log('exchange -->> ' + exchange);
				if(exchange === 'kucoin'){
					for (const pair of Object.keys(pairs[exchange])){
						// console.log('pair -->>' + pair)
						await pairs[exchange][pair].checkCondition1Day();
					}
				}
			}
	}

	const init1Week: any = async () => {
		console.log(`inside INIT func for Week at ${new Date()}`);
			await fetchCandleEngine("week");
			for (const exchange of Object.keys(pairs)) {
				// console.log('exchange -->> ' + exchange);
				if(exchange === 'kucoin') {
					for (const pair of Object.keys(pairs[exchange])){
						// console.log('pair -->>' + pair)
						await pairs[exchange][pair].checkCondition1Week();
					}
				}
			}
	}

	const init1hr: any = async () => {
		console.log(`inside INIT func at ${new Date()}`);
			await fetchCandleEngine1hr();
			for (const exchange of Object.keys(pairs)) {
				if(exchange === 'kucoin') {
					for (const pair of Object.keys(pairs[exchange])){
						await pairs[exchange][pair].checkCondition1Hr();
					}
				}
			}
	}
	
	const normalRun1Day: any = async () => {
		if (ranOnce) return;
		ranOnce = true;
		await init1Day();
	};

	const normalRun1Week: any = async () => {
		if (ranOnce1Week) return;
		ranOnce1Week = true;
		await init1Week();
	};

	const normalRun1Hr: any = async () => {
		if (ranOnce) return;
		ranOnce = true;
		init1hr();
	};

	const forceRun1Day: any = async () => {
		for (let i = 0; i < timerArray.length; i++) {
			clearInterval(timerArray[i]);
		}
		init1Day();
	};
	const forceRun1Hr: any = async () => {
		for (let i = 0; i < timerArray.length; i++) {
			clearInterval(timerArray[i]);
		}
		init1hr();
	};

	return {
		normalRun1Day,
		forceRun1Day,
		normalRun1Hr,
		forceRun1Hr,
		normalRun1Week
	}
}

export default init();