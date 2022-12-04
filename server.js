let fs = require('fs');
let fetch = require('node-fetch');
let http = require('http');
let https = require('https');

//////////////////////////// Настройки SSL и бота Telegram ///////
let privateKey = fs.readFileSync('/etc/letsencrypt/live/mirax-ptz.ru/privkey.pem', 'utf8');
let certificate = fs.readFileSync('/etc/letsencrypt/live/mirax-ptz.ru/fullchain.pem', 'utf8');
let botApiToken = '5941309037:AAHX_tNBXWrX6c6Qrbzy-Ub5VYzLgcU-g_w'
/////////////////////////////////////////////////////////////////

let credentials = { key: privateKey, cert: certificate };
let express = require('express');
let app = express();
app.use(express.json())
let redirectApp = express();

app.use('/', express.static('client'))

/////////////////////// Здесь твой код //////////////
app.get('/getData', (req, res) => {
  console.log(req);
  res.status(200).send()
})

app.post('/postData', (req, res) => {
  let dataJson = []
  try {
    dataJson = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
  } catch (error) {
    dataJson = []
  }
  dataJson.push(req.body)
  fs.writeFileSync('./data.json', JSON.stringify(dataJson));
  res.status(200).send()
})

setInterval(() => {
  let dataJson = []
  try {
    dataJson = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
  } catch (error) {
    dataJson = []
  }
  for (task of dataJson) {
    let taskDateTime = new Date(task.dateTime)
    let curDateTime = new Date()

    if (taskDateTime.setSeconds(0, 0) === curDateTime.setSeconds(0, 0) && !task.sent) {
      console.log('Sending to Telegram');
      fetch(`https://api.telegram.org/bot${botApiToken}/sendMessage?chat_id=${task.idTelegram}&text=${task.text}`)
      task.sent = true
    }

    fs.writeFileSync('./data.json', JSON.stringify(dataJson));
  }
}, 5000);
////////////////////////////////////////////////////

redirectApp.use(function requireHTTPS(req, res, next) {
  return res.redirect('https://' + req.headers.host + req.url);
})
let httpServer = http.createServer(redirectApp);
let httpsServer = https.createServer(credentials, app);
httpServer.listen(80);
httpsServer.listen(443);