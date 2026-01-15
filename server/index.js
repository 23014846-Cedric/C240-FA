const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit:'1mb'}));

// Serve project root as static so assets (css/, js/, data/) are available
app.use(express.static(path.join(__dirname, '..')));

// Configure EJS views
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

const DATA_FILE = path.join(__dirname, 'data.json');

function readData(){
  try { return JSON.parse(fs.readFileSync(DATA_FILE,'utf8') || '{}'); } catch(e){ return {}; }
}
function writeData(obj){ fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2)); }

app.get('/api/answers', (req,res)=>{
  res.json(readData());
});

// Render main app page
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/api/answers', (req,res)=>{
  const incoming = req.body || {};
  const data = readData();
  // merge simple
  Object.assign(data, incoming);
  writeData(data);
  res.json({status:'ok'});
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('OfferUp Coach server running on', port));
