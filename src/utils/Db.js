const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(`${__dirname}/../../data/wechall.db`);

class Db {
	static async init() {
		try {
			const sql = "CREATE TABLE IF NOT EXISTS userRanks (id INTEGER PRIMARY KEY, profile TEXT, rank int NOT NULL, ctime TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
			await db.run(sql);
		} catch (err) {
			return console.error(err.message);
		}
	}

	static async query(sql, data) {
		return new Promise(function(resolve,reject){
			db.all(sql, data, (err, rows) => {
				if (err) { return reject(err); }
				
				resolve(rows);
			});
		});
	}
}

module.exports = Db;