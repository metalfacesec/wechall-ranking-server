const cors = require('cors');
const Db = require('./utils/Db');
const express = require('express');
const Wechall = require('./utils/Wechall');

const config = require('../config/config.json');

var app = express();
var port = process.env.PORT || 8085;
var router = express.Router();

var corsOptions = {
	origin: config.corsUrl,
	optionsSuccessStatus: 200
}

router.get('/rank', cors(corsOptions), async function(req, res) {
	if (typeof req.query !== 'object' || typeof req.query.profile !== 'string' || !req.query.profile.length) {
		return res.json(getResponse(400, 'Invalid request', []));
	}
	
	try {
		let rank = await Wechall.getRank(req.query.profile);
		res.json(getResponse(200, 'success', `${rank}`));
	} catch (err) {
		console.log(err);
		return res.json(getResponse(400, 'Invalid request', []));
	}
});

function getResponse(status, message, data) {
	return {
		status: status,
		message: message,
		data: data
	}
}

Db.init();

app.use('/api', router);

app.listen(port);
console.log('Server listening on port ' + port);
