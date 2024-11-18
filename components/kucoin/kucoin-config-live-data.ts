// /**
//  * copy to config.js, and write configure
//  */
// module.exports = {
// 	/** set API baseUrl, */
// 	/**   if not set this key, or empty, or false, or undefined, */
// 	/**   default baseUrl will be set by `process.env.PRODUCTION` */
// 	/**   if process.env.PRODUCTION === 'prod', the default value will be https://api.kucoin.io */
// 	/**   else use sandbox as https://openapi-sandbox.kucoin.io */
// 	/** Auth infos */
// 	/**   key is API key */
// 	/**   secret is API secret */
// 	/**   passphrase as API passphrase */
// 	baseUrl: 'https://openapi-sandbox.kucoin.com',
// 	apiAuth: {
// 		key: '62711be22b968a0001535337',
// 		secret: '8bff0a9a-73a6-419b-aa53-8845abaf02fb',
// 		passphrase: '12344321',
// 	},
// 	authVersion: 2,
// };

// this is for prod
const init = {
	baseUrl: 'https://api.kucoin.com',
	apiAuth: {
		key: '627fd7f9401b7500019b3a11',
		secret: 'acb30ade-9d93-42d8-ae17-93c31bd49eae',
		passphrase: '12344321',
	},
	authVersion: 2,
};

const APILiveData = require('kucoin-node-sdk');
APILiveData.init(init);

export default APILiveData;


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


