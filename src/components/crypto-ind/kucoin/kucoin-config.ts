// /**
//  * copy to config.js, and write configure
//  */
const init = {
	/** set API baseUrl, */
	/**   if not set this key, or empty, or false, or undefined, */
	/**   default baseUrl will be set by `process.env.PRODUCTION` */
	/**   if process.env.PRODUCTION === 'prod', the default value will be https://api.kucoin.io */
	/**   else use sandbox as https://openapi-sandbox.kucoin.io */
	/** Auth infos */
	/**   key is API key */
	/**   secret is API secret */
	/**   passphrase as API passphrase */
	// baseUrl: 'https://openapi-sandbox.kucoin.com',
	baseUrl: 'https://api-sandbox-futures.kucoin.com',
	// apiAuth: {
	// 	key: '62bed3f641a5330001d19ac0',
	// 	secret: 'f4323417-2e93-42e9-aa95-74f6527b4916',
	// 	passphrase: '12344321',
	// },
	apiAuth: {
		key: '62711be22b968a0001535337',
		secret: '8bff0a9a-73a6-419b-aa53-8845abaf02fb',
		passphrase: '12344321',
	},
	authVersion: 2,
};

const API = require('kucoin-node-sdk');
API.init(init);

export default API;

// // this is for prod
// module.exports = {
// 	baseUrl: 'https://api.kucoin.com',
// 	apiAuth: {
// 		key: '627fd7f9401b7500019b3a11',
// 		secret: 'acb30ade-9d93-42d8-ae17-93c31bd49eae',
// 		passphrase: '12344321',
// 	},
// 	authVersion: 2,
// };

// ingore foloowing
// const kucoinConfig = {
// baseUrl: 'https://openapi-sandbox.kucoin.cc',
// apiAuth: {
//   key: '626fed0f37a60900019853e6',
//   secret: '8aea059f-7a85-4b18-a448-95cb708c3eac',
//   passphrase: '123321'
// },
// authVersion: 2}

// export default kucoinConfig;


