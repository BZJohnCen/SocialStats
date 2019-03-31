
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const express = require('express');
const http = require('http')
const cors = require('cors');
const shceduler = require('node-schedule');
const env = process.env.NODE_ENV || "development";
const port = env === 'production' ? process.env.PORT : 4000;
const dotEnv = require('dotenv').config();
const user = require('./api/user');
const test = require('./api/test');
const twitterEndpoints = require('./api/twitter_endpoints');
const TwitterHelper = require('./data/twitter/twitter_helper');
const app = express();


//mongo
mongoose.connect(env === "production" ? process.env.MONGO_URL : process.env.MONGO_DEV_URL, { useNewUrlParser: true })

// ------------------------------
// EXPRESS SET UP BEGIN
// ------------------------------
var corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept', 'token', 'content-type'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors(corsOptions));
// ------------------------------
// EXPRESS SET UP END
// ------------------------------

// ------------------------------
// EXPRESS ROUTING
// ------------------------------
app.use('/twitter', twitterEndpoints);
app.use('/user', user);
if (env === 'development')
    app.use('/test', test);
// ------------------------------
// EXPRESS ROUTING END
// ------------------------------

// ------------------------------
// EXPRESS SERVE AND ENDPOINTS
// ------------------------------
app.get('/', (req, res) => {
    res.send('<h1><i>ss Test homepage</i></h1>')
});

app.get('/tos', (req, res) => {
    res.send('<h1>Mock TOS page for Facebook</h1>')
});
// EXPRESS SERVE END


// ------------------------------
// SCHEDULER
// ------------------------------
shceduler.scheduleJob('30 23 * * * *', () => {
    console.log('Scheduler is running');

    Promise.all([TwitterHelper.runSnapshot()]).then(() => {
        console.log('Snapshot gathering complete');
    }).catch(e => {
        console.log('Error while gathering snapshot', e)
    })
});

// ------------------------------
// SCHEDULER end
// ------------------------------

// ------------------------------
// CREATE HTTP SERVER
// ------------------------------
http.createServer(app).listen(port, () => {
    console.log('Our project is running in ' + env + '. ', (new Date()).toString());
    console.log('running on port is runing on port ', port);
}).on('error', (err) => {
    console.error(JSON.stringify(err));
});
// ------------------------------
// CREATE HTTP SERVER END
// ------------------------------
