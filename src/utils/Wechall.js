const axios = require('axios');
const Db = require('./Db');

class Wechall {
	static baseUrl = 'https://www.wechall.net/profile/';

	static async getRank(profile) {
		let dbRank = await Wechall.getRankFromDB(profile);
		if (dbRank.length && typeof dbRank[0].rank !== 'undefined') {
			return {
				rank: dbRank[0].rank,
				time: `${new Date(dbRank[0].ctime).toLocaleDateString()} ${new Date(dbRank[0].ctime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric"})}`
			}
		}

		let rank = await Wechall.getRankFromWechall(profile);
		Wechall.insertRankInDB(profile, rank);
		return {
			rank: dbRank[0].rank,
			time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric"})}`
		}
	}

	static async insertRankInDB(profile, rank) {
		try {
			const sql = "INSERT INTO userRanks (`profile`, `rank`) VALUES (?,?)";

			await Db.query(sql, [profile, rank]);
		} catch (err) {
			return console.error(err.message);
		}
	}

	static async getRankFromDB(profile) {
		try {
			const sql = "SELECT rank, ctime FROM userRanks WHERE profile=? AND datetime(ctime) >=datetime('now', '-1 Hour') ORDER BY ctime DESC LIMIT 1";
			
			return await Db.query(sql, [profile]);
		} catch (err) {
			return console.error(err.message);
		}
	}

	static async getRankFromWechall(profile) {
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