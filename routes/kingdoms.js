const path = require('path');
const appDir = path.dirname(require.main.filename);

const express = require("express");
const store = require(appDir + "/services/store.js");

const kingdoms = require(appDir + "/data/kingdoms.json");
const kings = require(appDir + "/data/kings.json");
const queens = require(appDir + "/data/queens.json");
const castles = require(appDir + "/data/castles.json");

const router = express.Router();

router.get('/', (req, res) => {

	const allKingdoms = [];

	for(let k in kingdoms) {

		const count = store.retrieve(kingdoms, kingdoms[k].id, 'castleIds');
		const obj = { 
						id: kingdoms[k].id,
						name: store.retrieve(kingdoms, kingdoms[k].id, 'name'),
						kingName: store.retrieve(kings, kingdoms[k].kingId, 'name'),
						queenName: store.retrieve(queens, kingdoms[k].queenId, 'name'),
						castleCount: count.length
					}

		allKingdoms.push(obj);
	}

	res.render("kingdoms", { allKingdoms });
});

router.post('/', (req, res) => {

	const name = req.body.name;
	const king = req.body.king;
	const queen = req.body.queen;

	const kingdomId = store.newId(kingdoms);
	const kingId = store.newId(kings);
	const queenId = store.newId(queens);

	kings[kingId] = { 'id': kingId, 'name': king }
	queens[queenId] = { 'id': queenId, 'name': queen }
	kingdoms[kingdomId] = { 'id': kingdomId, 'name': name, 'kingId': kingId, 'queenId': queenId, 'castleIds': [] };

	store.write(appDir + "/data/kings.json", kings);
	store.write(appDir + "/data/queens.json", queens);
	store.write(appDir + "/data/kingdoms.json", kingdoms);

	res.redirect('/');

});

router.post('/:kingdomId/remove', (req, res) => {

	const kingdomId = req.params.kingdomId;
	delete kingdoms[kingdomId];

	store.write(appDir + "/data/kingdoms.json", kingdoms);
	
	res.redirect("/");
});

module.exports = router;