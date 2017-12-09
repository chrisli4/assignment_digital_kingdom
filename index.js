const express = require("express");
const path = require('path');
const exphbs  = require('express-handlebars');
const kingdoms = require("./routes/kingdoms");
const kingdom = require("./routes/kingdom");
const castle = require("./routes/castle");
const liege = require("./routes/liege");
const bodyParser = require("body-parser");

const fs = require("fs");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/', kingdoms);
app.use('/kingdoms', kingdom);
app.use('/castles', castle);
app.use('/lieges', liege);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(4200, () => {
	console.log(`listening on localhost:4200`);
});