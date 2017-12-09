const fs = require('fs');

const retrieve = (json, id, prop) => {
	
	const p = json[id][prop];

	return p ? p : '';
}

const createObj = (type, id, name) => {

	const obj = {
		id: id,
		name: name
	};

	switch(type) {
		case 'kingdoms':
			obj.castleIds = [];
			break;
		case 'castles':
			obj.liegeIds = [];
			break;
		case 'lieges':
			obj.vassalIds = [];
			break;
		case 'vassals': 
			obj.kingdomIds = [];
			break;
		default: 
			break;
	}

	return obj;
}

const newId = (json) => {
	return Object.keys(json).length + 1;
};




const _getIds = (obj) => {
	for(let prop in obj) {
		if(obj.hasOwnProperty(prop)) {
			if(Array.isArray(obj[prop]))
				return obj[prop];
		};
	};
};

const _getKey = (obj) => {
	for(let prop in obj){
		if(obj.hasOwnProperty(prop)) {
			if(Array.isArray(obj[prop]))
				return prop;
		};
	};
};

const getObj = (json, id) => {
	return json[id];
};



const _convertIds = (json, ids) => {
	
	if(ids.length != 0) {
		return ids.map((id) => {
			return json[id];
		});
	}
	else 
		return [];
};

const getChildren = (json, id, child) => {
	const obj = json[id];
	const ids = _getIds(obj);
	
	if(ids.length > 0) {
		return ids.map((id) => {
			return child[id];
		});

	} else {
		return [];
	}
};


const write = (path, json) => {

	const str = JSON.stringify(json, null, 2);

	fs.writeFileSync(path, str, (err) => {
		throw err;
		console.log('file saved');
	});
}

const addId = (json, id, cidToAdd, path) => {

	const k = _getKey(json[id]);
	const arr = json[id][k];
	
	arr.push(cidToAdd);
	json[id][k] = arr;

	write(path, json)

};

const addObj = (json, newId, objToAdd, path) => {

	json[id] = objToAdd;
	
	write(path, json);
}

const add = (type, json, child, id, name) => {
	
	const newId = Object.keys(child).length + 1; 

	const objToAdd = createObj(type, newId, name);
	
	addObj(child, newId, objToAdd, childPath);
	addId(json, id, newId, path);



};

module.exports = {
	retrieve,
	write,
	newId,
	createObj
}