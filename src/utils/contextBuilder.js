'use strict'

const localtunnel = require('localtunnel');
const { ConnectionTimeoutError } = require('redis');
async function getUrl() {
	const tunnel = await localtunnel({ port: 3015 });
	return `${tunnel.url}/osl-bap/dsep`;
};
exports.contextBuilder = async (transactionId, messageId, action, bppId, bppUri) => {
	const tunnelURI = await getUrl().then(result => {
		return result;
	}).catch(err => {
		console.log(err);
	})
	const context = {
		domain: process.env.DOMAIN,
		action,
		bap_id: process.env.BAP_ID,
		bap_uri: process.env.BAP_URI || tunnelURI,
		bpp_id: bppId,
		bpp_uri: bppUri,
		timestamp: new Date(),
		ttl: process.env.BAP_TTL,
		version: process.env.SCHEMA_CORE_VERSION,
		message_id: messageId,
		transaction_id: transactionId,
	}

	const filteredContext = Object.fromEntries(Object.entries(context).filter((entry) => entry[1] !== undefined))
	return filteredContext
}
