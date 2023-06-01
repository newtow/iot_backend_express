const mqtt = require('mqtt');
const db = require("./db_config");

class MqttHandler {

  constructor() {
    this.mqttClient = null;
    this.host = 'mqtt://test.mosquitto.org';
    
  }
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host);

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.reconnect();
     
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('esp32/mqtt', {qos: 0});
    this.mqttClient.subscribe('esp32/mqtt/data/relay', {qos: 0});
    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      if (topic === 'esp32/mqtt/data/relay'){
       var data = message;
      const sql = "INSERT INTO data_relay (status) VALUES ?";
      const values =[[data]]
      db.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("data tersimpan");
        });
        console.log(message.toString());
      }
    
      
    

    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: esp32/mqtt
  sendMessage(message) {
    this.mqttClient.publish('esp32/mqtt', message);
  }
 getdatamqtt(){
  
  this.mqttClient.on('message', function (topic, message) {
  return message.toString();
  });
  console.log(data)
 }
    
  
  

}

module.exports = MqttHandler;