const express = require("express");
const store = require("../services/store.js");

const path = require('path');
const appDir = path.dirname(require.main.filename);

const kingdoms = require(appDir + "/data/kingdoms.json");
const kings = require(appDir + "/data/kings.json");
const queens = require(appDir + "/data/queens.json");
const castles = require(appDir + "/data/castles.json");

const router = express.Router();
// get castles 

router.get('/:kingdomId', (req, res) => {

	const kingdomId = req.params.kingdomId;

	const castleIds = store.retrieve(kingdoms, kingdomId, 'castleIds');
	const kingdomName = store.retrieve(kingdoms, kingdomId, 'name');

	console.log(castleIds);

	if(castleIds.length != 0) {

		var allCastles = castleIds.map((id) => {
			return castles[id];
		});
	}

	res.render("kingdom", { kingdomName, kingdomId, allCastles });

});

router.post('/:kingdomId/castles/add', (req, res) => {

	const name = req.body.name;
	const newCastleId = store.newId(castles);

	const kingdomId = req.params.kingdomId;
	
	kingdoms[kingdomId].castleIds.push(newCastleId);
	castles[newCastleId] = { id: newCastleId, name: name, liegeIds: [] };

	store.write(appDir + "/data/castles.json", castles);
	store.write(appDir + "/data/kingdoms.json", kingdoms);

	res.redirect("back");
});

router.post('/:kingdomId/castles/:castleId/remove', (req, res) => {

	const kingdomId = req.params.kingdomId;
	const castleId = req.params.castleId;

	const ids = kingdoms[kingdomId].castleIds;

	const newIds = ids.filter((id) => {
		return parseInt(id) !== parseInt(castleId);
	});

	kingdoms[kingdomId].castleIds = newIds;
	delete castles[castleId];

	store.write(appDir + "/data/castles.json", castles);
	store.write(appDir + "/data/kingdoms.json", kingdoms);

	res.redirect('/kingdoms/' + kingdomId);

});

module.exports = router;