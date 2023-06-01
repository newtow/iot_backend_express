module.exports = {
    "up": "CREATE TABLE data_relay_1 (id INT NOT NULL AUTO_INCREMENT, data VARCHAR(100),PRIMARY KEY (id)) ",
    "down": "DROP TABLE  data_relay_1"
}