// new ones
type kucoinres = {
	code: string;
	// data: string[string, string][]
	data: [string, string, string, string, string, string, string][];
};
type binanceres = [number, string, string, string, string, string, number, string, number, string, string, string][];

type cpr = {
	pivot: number;
	bc: number;
	tc: number;
	r1: number;
	r2: number;
	// r3: number,
	s1: number;
	s2: number;
	// r3: number,
};

type camrilla = {
	pivot: number;
	h3: number;
	h4: number;
	l3: number;
	l4: number;
};

type ohlcv = {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
}

type oneCandle = {
	name: string;
	time: number;
	open: number;
	close: number;
	high: number;
	low: number;
	cpr: cpr;
	camrilla: camrilla;
};

type series = oneCandle[];

type checkedSeries = {
	time: number;
	open: number;
	close: number;
	high: number;
	low: number;
	cpr: cpr;
	camrilla: camrilla;
	isHigherThirdZone: boolean;
};
