module.exports = {
    "up": "CREATE TABLE waktu_pakan (id INT NOT NULL AUTO_INCREMENT, waktu DATETIME ,PRIMARY KEY (id))",
    "down": "DROP TABLE waktu_pakan"
}