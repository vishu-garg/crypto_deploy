type RSI = {
	id: string,
	indicator: 'rsi',
	result: { value: number },
};

type MACD = {
	id: string,
	indicator: 'macd',
	result: {
		valueMACD: number
		valueMACDSignal: number,
		valueMACDHist: number,
	},
};

type StochRSI = {
	id: string,
	indicator: 'stochrsi',
	result: {
		valueFastK: number,
		valueFastD: number,
	},
};

type kucoinWebsocketHandshake = {
	code: number,
	data: {
		token: string,
		instanceServers: [[Object]],
	},
};

type OrderBook = {
	dirty: boolean,
	sequence: number,
	asks: string[][],
	bids: string[][],
	ping: number,
};

type Hr24Stats = {
	time: number, // time
	symbol: string, // symbol
	buy: string, // bestAsk
	sell: string, // bestBid
	changeRate: string, // 24h change rate
	changePrice: string, // 24h change price
	high: string // 24h highest price
	low: string // 24h lowest price
	vol: string // 24h volume，the aggregated trading volume in BTC
	volValue: string // 24h total, the trading volume in quote currency of last 24 hours
	last: string // last price
	averagePrice: string // 24h average transaction price yesterday
	takerFeeRate: string // Basic Taker Fee
	makerFeeRate: string // Basic Maker Fee
	takerCoefficient: string // Taker Fee Coefficient
	makerCoefficient: string // Maker Fee Coefficient
};