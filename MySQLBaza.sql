CREATE TABLE Users(
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(30),
lastname VARCHAR(30),
email VARCHAR(50),
birthday TIMESTAMP,
reg_date TIMESTAMP,
image VARCHAR(50),
mob_num VARCHAR(20)
);

CREATE TABLE Rate(
id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
user_id INT(6) NOT NULL,
comm VARCHAR(50),
stars INT(1) NOT NULL
);


5810913c719dc21ebcaf83aa.jpg