module.exports = {
    "up": "CREATE TABLE timer_pakan (id INT NOT NULL AUTO_INCREMENT, jam1 INT(11) ,menit1 INT(11),jam2 INT(11) ,menit2 INT(11),jam3 INT(11) ,menit3 INT(11),PRIMARY KEY (id))",
    "down": "DROP TABLE timer_pakan"
}