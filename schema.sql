DROP DATABASE IF EXISTS Ecommerce;
CREATE DATABASE Ecommerce;
USE Ecommerce;
CREATE TABLE guitars (
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(100) NOT NULL,
  category VARCHAR(45) NOT NULL,
  net_price INT(11) NULL default 0,
  list_price INT(11) NULL default 0, 
);