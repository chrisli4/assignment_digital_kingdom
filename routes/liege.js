const express = require("express");
const store = require("../services/store.js");

const path = require('path');
const appDir = path.dirname(require.main.filename);

const lieges = require(appDir + "/data/lieges.json");
const vassals = require(appDir + "/data/vassals.json");

const router = express.Router();


router.get('/:liegeId', (req, res) => {

	const liegeId = req.params.liegeId;
	const liegeName = lieges[liegeId].name;

	const vassalIds = lieges[liegeId].vassalIds;


	if(vassalIds.length != 0) {

		var allVassals = vassalIds.map((id) => {
			return vassals[id];
		});
	}

	res.render("liege", { allVassals, liegeId, liegeName });

});

router.post('/:liegeId/vassal/add', (req, res) => {

	const name = req.body.name;
	const newVassalId = store.newId(vassals);

	const liegeId = req.params.liegeId;
	
	lieges[liegeId].vassalIds.push(newVassalId);
	vassals[newVassalId] = { id: newVassalId, name: name };

	store.write(appDir + "/data/lieges.json", lieges);
	store.write(appDir + "/data/vassals.json", vassals);

	res.redirect("back");
});

router.post('/:liegeId/vassals/:vassalId/remove', (req, res) => {

	const liegeId = req.params.liegeId;
	const vassalId = req.params.vassalId;

	const ids = lieges[liegeId].vassalIds;

	const newIds = ids.filter((id) => {
		return parseInt(id) !== parseInt(vassalId);
	});

	lieges[liegeId].vassalIds = newIds;
	delete vassals[vassalId];

	store.write(appDir + "/data/lieges.json", lieges);
	store.write(appDir + "/data/vassals.json", vassals);

	res.redirect("back");
});

module.exports = router;