var axios = require('axios');

class Wechall {
	static baseUrl = 'https://www.wechall.net/profile/';
	static async getRank(profile) {
		if (!profile.match(/^[0-9a-z]+$/)) {
			throw 'Invalid request';
		}

		let response = await axios.get(`${Wechall.baseUrl}${profile}`);
		if (typeof response !== 'object' || typeof response.data !== 'string' || !response.data.length) {
			throw 'Unknown response from wechall';
		}
		
		let html = response.data;

		if (!html.includes('<th>Global Rank</th>')) {
			throw "Can't find global rank <th>";
		}

		html = html.split('<th>Global Rank</th>')[1];

		if (!html.includes("</a>")) {
			throw 'Post split 1 html has no close anchor';
		}

		html = html.split('</a>')[0];

		if (!html.includes('<td><a href=')) {
			throw 'Post split 2 html has no anchor or td';
		}

		html = html.replace('<td><a href=', '');

		if (!html.includes('>')) {
			throw 'Post replace has no greater than';
		}

		return html.split('>')[1];
	}
}

module.exports = Wechall;