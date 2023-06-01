var express = require("express");
const cors = require('cors');
var app = express();

const bodyParser = require('body-parser')
const mqtt = require('mqtt')
const cron = require('node-cron');
const db = require("./db_config");
app.use(express.static("node_modules"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
//=============================================================================
function pakan(){
  client.publish('esp32/mqtt','1')
  setTimeout(function(){
    client.publish('esp32/mqtt','2')
   
  }, 2000); 
}
//=============================================================================
let results
var M = 1;
var H = 1;
var M1 = 1;
var H1 = 1
var M2 = 1;
var H2 = 1
const setOutput = (result) => {
  if(result == !null){
  M = result[0].menit1
  H = result[0].jam1
  M1 = result[0].menit2
  H1 = result[0].jam2
  M2 = result[0].menit3
  H2 = result[0].jam3
  }
  else{
    console.log("data kosong")
  }

//------------------------------------schadule---------------------------------
cron.schedule(`${M} ${H} * * *`, () => {
  pakan()
});
cron.schedule(`${M1} ${H1} * * *`, () => {
  pakan()
});
cron.schedule(`${M2} ${H2} * * *`, () => {
  pakan()
});
}

const sql = "SELECT * FROM timer_pakan ORDER BY id DESC LIMIT 1";
  
    db.query(sql, function (err, result) {
      if (err) {
        console.log("internal error", err);
        return;
    }
      
    // This is the important function
    setOutput(result);
      });
 
  
    
    



//------------------------------------------------------------------------------
//--------------------------mqtt------------------------------------------------
var client = mqtt.connect("mqtt://test.mosquitto.org")
// Routes
client.on('connect', () => {
  console.log("Mqtt Connected")
  client.subscribe('esp32/mqtt')
  client.subscribe("esp32/mqtt/data/pakan/data")
  client.subscribe("esp32/mqtt/data/pakan")
  client.subscribe("esp32/mqtt/data/pompa")
  client.subscribe("esp32/mqtt/data/pompa2")
  client.subscribe("esp32/mqtt/data/relay")
  client.subscribe("esp32/mqtt/")
})
client.on('message', (topic, message) => {
  if (topic === 'esp32/mqtt'){
    
console.log(message.toString());
    
}
  if (topic === 'esp32/mqtt/data/pakan'){
    
    var data = message.toString();
    const sql = "INSERT INTO data_pakan (data) VALUES ?";
    const values =[[data]]
    db.query(sql, [values], function (err, result) {
      if (err) throw err;
      
      });
    
}
if (topic === 'esp32/mqtt/data/pompa'){
    
  var data = message.toString();
  const sql = "INSERT INTO data_relay_1 (data) VALUES ?";
  const values =[[data]]
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("data pompa1 tersimpan");
    });
  
}
if (topic === 'esp32/mqtt/data/pompa2'){
    
  var data = message.toString();
  const sql = "INSERT INTO data_relay_2 (data) VALUES ?";
  const values =[[data]]
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("data pompa2 tersimpan");
    });
  
}
if (topic === 'esp32/mqtt/data/pakan/data'){
    
  if(message.toString() == "pakan diberikan"){

    const sql = "INSERT INTO waktu_pakan (waktu) VALUES ?";
    var date = new Date;
    var date =
    date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
      console.log(date);
    const values = [[date]]
    db.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("waktu pakan diberi terakhir tersimpan");
      });
  }

  
}
})
//===========================================routes=============================================

app.post('/timer',(req,res)=>{
  
  const sql = "INSERT INTO timer_pakan (jam1,menit1,jam2,menit2,jam3,menit3) VALUES ?";
  const values =[[req.body.jam1,req.body.menit1,req.body.jam2,req.body.menit2,req.body.jam3,req.body.menit3]]
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("data timer pakan tersimpan");
    res.json({
      data:result
    })
    });




});
app.get('/',(req,res)=>{
 
 res.json({
  web:"running"
 })
 console.log("server running")

});
app.get('/timer',(req,res)=>{
  

  const sql = "SELECT * FROM timer_pakan ORDER BY id DESC LIMIT 1";
    
    db.query(sql, function (err, result) {
      if (err) {
        res.json({
          data: "kosong"
        })
      }else{
        res.json({data:result[0]})
      }
     
      });
  
});
app.get('/pakan',(req,res)=>{
  

  const sql = "SELECT * FROM data_pakan ORDER BY id DESC LIMIT 1";
    
    db.query(sql, function (err, result) {
      if (err) {
        res.json({
          data: "kosong"
        })
      }else{
        res.json({data:result[0]})
      }
      
    
    });
  
});
app.get('/pompa-1',(req,res)=>{
  

  const sql = "SELECT * FROM data_relay_1 ORDER BY id DESC LIMIT 1";
    
    db.query(sql, function (err, result) {
      if (err) {
        res.json({
          data: "kosong"
        })
      }else{
        res.json({data:result[0]})
      }
      });
  
});
app.get('/pompa-2',(req,res)=>{
  

  const sql = "SELECT * FROM data_relay_1 ORDER BY id DESC LIMIT 1";
    
    db.query(sql, function (err, result) {
      if (err) {
        res.json({
          data: "kosong"
        })
      }else{
        res.json({data:result[0]})
      }
      });
  
});
app.get('/waktu-pakan',(req,res)=>{
  

  const sql = "SELECT * FROM waktu_pakan ORDER BY id DESC LIMIT 1";
    
    db.query(sql, function (err, result) {
      if (err) {
        res.json({
          data: "kosong"
        })
      }else{
        res.json({data:result[0]})
      }
      });
  
});
app.post("/pakan", function(req, res) {
  if (res.status(200)) {
        pakan();
    res.json({
      status:true,
    })
  } else {
    res.json({
      status:false,
    })
  }
  
});
app.post("/pompa1-on", function(req, res) {
  if (res.status(200)) {
    client.publish('esp32/mqtt','3')    
    res.json({
      status:true,
    })
  } else {
    res.json({
      status:false,
    })
  }
  
});
app.post("/pompa1-off", function(req, res) {
  if (res.status(200)) {
    client.publish('esp32/mqtt','4')    
    res.json({
      status:true,
    })
  } else {
    res.json({
      status:false,
    })
  }
  
});
app.post("/pompa2-on", function(req, res) {
  if (res.status(200)) {
    client.publish('esp32/mqtt','5')    
    res.json({
      status:true,
    })
  } else {
    res.json({
      status:false,
    })
  }
  
});
app.post("/pompa2-off", function(req, res) {
  if (res.status(200)) {
    client.publish('esp32/mqtt','6')    
    res.json({
      status:true,
    })
  } else {
    res.json({
      status:false,
    })
  }
  
});
var server = app.listen(8000, function () {
    console.log("app running on port.", server.address().port);
});