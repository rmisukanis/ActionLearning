require('dotenv').config();           // load env variables once, at the top
const { Asset } = require('./models');

var path = require('path')
var config = require('./config.json')
var express = require('express')
var session = require('express-session')
const { sync } = require("./config/db");
var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json());  // This parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'secret', resave: 'false', saveUninitialized: 'false' }))



// Initial view - loads Connect To QuickBooks Button
app.get('/', function (req, res) {
  res.render('home', config)
})

// Sign In With Intuit, Connect To QuickBooks, or Get App Now
// These calls will redirect to Intuit's authorization flow
app.use('/sign_in_with_intuit', require('./routes/sign_in_with_intuit.js'))
app.use('/connect_to_quickbooks', require('./routes/connect_to_quickbooks.js'))
app.use('/connect_handler', require('./routes/connect_handler.js'))

// Callback - called via redirect_uri after authorization
app.use('/callback', require('./routes/callback.js'))

// Connected - call OpenID and render connected view
app.use('/connected', require('./routes/connected.js'))

// Call an example API over OAuth2
app.use('/api_call', require('./routes/api_call.js'))

//call asset query
app.use('/assets', require('./routes/assets.js'));

//uploading current assets (bill account)
app.use('/apiTesting', require('./routes/bill.js'));

//uploading current assets (bill account)
app.use('/apiTesting', require('./routes/journalentry.js'));


//call generic query
app.use('/queryGeneric', require('./routes/queryGeneric.js'));


//call query Invoice
app.use('/queryInvoice', require('./routes/queryInvoice.js'));


//call query Deposit
app.use('/queryDeposit', require('./routes/queryDeposit.js'));


//API Testing
app.use('/queryAPITesting', require('./routes/queryAPITesting.js'));



// Start server on HTTP (will use ngrok for HTTPS forwarding)
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })
sync({ alter: true })
  .then(() => {
    console.log('✅ Database & tables ready');
    app.listen(3000, () => console.log('Example app listening on port 3000!'));
  })
  .catch((err) => {
    console.error('❌ Database sync error:', err);
  });