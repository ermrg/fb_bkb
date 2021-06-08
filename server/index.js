var express = require('express');
var app = express();
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
app.set('port', (process.env.PORT || 5000));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

require('./db.js')(app);
require('./matches.js')(app);''
require('./bot.js')(app);