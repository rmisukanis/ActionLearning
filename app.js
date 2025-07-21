require('dotenv').config();           // load env variables once, at the top
const { Asset } = require('./models');

const path = require('path')
const config = require('./config.json')
const express = require('express')
const session = require('express-session')
const sequelize = require("./config/db");
const app = express()

const dbImportAssets = require('./routes/dbFunctions.js');
const journalEntryRoutes = require('./routes/journalEntries');

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

//call asset query and post data to backend
app.use('/assets', require('./routes/assets.js'));

//uploading current assets (bill account)
app.use('/bill', require('./routes/bill.js'));

//uploading current assets (bill account)
app.use('/bill', require('./routes/journalentry.js'));


//call generic query
app.use('/queryGeneric', require('./routes/queryGeneric.js'));


//call query Invoice
app.use('/queryInvoice', require('./routes/queryInvoice.js'));

//call query Deposit
app.use('/queryDeposit', require('./routes/queryDeposit.js'));

app.use('/queryAPITesting', require('./routes/queryAPITesting.js'));

//database imports/assets controller (back-end functionality)
app.use('/dbImportAssets', dbImportAssets);

//journal entries
app.use('/journal-entries', journalEntryRoutes);

//posting to quickbooks journal entry
app.use('/qbJournalEntry', require('./routes/qbJournalEntry.js'));

/*
sequelize.sync({ alter: true })
.then(() => {
console.log('✅ Database & tables ready');
app.listen(3000, () => console.log('Example app listening on port 3000!'));
})
.catch((err) => {
console.error('❌ Database sync error:', err);
});

app.listen(3000, () => {
  console.log('🚀 App running at http://localhost:3000');
});
*/
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database & tables ready');
    app.listen(3000, () => {
      console.log('🚀 App running at http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('❌ Database sync error:', err);
  });
