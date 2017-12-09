const express = require("express");
const store = require("../services/store.js");

const path = require('path');
const appDir = path.dirname(require.main.filename);

const castles = require(appDir + "/data/castles.json");
const lieges = require(appDir + "/data/lieges.json");

const router = express.Router();


router.get('/:castleId', (req, res) => {

	const castleId = req.params.castleId;
	const castleName = castles[castleId].name;

	const liegeIds = store.retrieve(castles, castleId, 'liegeIds');

	if(liegeIds.length !== 0) {
		var allLieges = liegeIds.map((id) => {
			return lieges[id];
		});
	}

	res.render("castle", { castleId, castleName, allLieges });

});

router.post('/:castleId/liege/add', (req, res) => {

	const name = req.body.name;
	const newLiegeId = store.newId(lieges);

	const castleId = req.params.castleId;
	
	castles[castleId].liegeIds.push(newLiegeId);
	lieges[newLiegeId] = { id: newLiegeId, name: name, vassalIds: [] };

	store.write(appDir + "/data/castles.json", castles);
	store.write(appDir + "/data/lieges.json", lieges);

	res.redirect("back");
});

router.post('/:castleId/lieges/:liegeId/remove', (req, res) => {

	const castleId = req.params.castleId;
	const liegeId = req.params.liegeId;

	const ids = castles[castleId].liegeIds;

	const newIds = ids.filter((id) => {
		return parseInt(id) !== parseInt(liegeId);
	});

	castles[castleId].liegeIds = newIds;
	delete lieges[liegeId];

	store.write(appDir + '/data/lieges.json', lieges);
	store.write(appDir + '/data/castles.json', castles);

	res.redirect('/castles/' + castleId);

});

module.exports = router;