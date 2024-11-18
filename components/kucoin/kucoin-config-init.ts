const API = require('kucoin-node-sdk');
API.init(require('@/components/kucoin/kucoin-config-live-data'));

export default API;
