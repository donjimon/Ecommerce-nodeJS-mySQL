DROP DATABASE IF EXISTS Ecommerce;
CREATE DATABASE Ecommerce;
USE Ecommerce;
CREATE TABLE guitars (
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(100) NULL,
  category INT (10) NULL,
  brand INT (10) NULL,
  net_price INT(10) NULL,
  list_price INT(10) NULL, 
  PRIMARY KEY (id) 
);
CREATE TABLE guitar_category (
  id INT NOT NULL AUTO_INCREMENT,
  category VARCHAR(100) NULL,
  inventory INT(10) NULL default 0, 
  PRIMARY KEY (id)
);
CREATE TABLE brands (
  id INT NOT NULL AUTO_INCREMENT,
  brand_name VARCHAR(100) NULL,
  inventory INT(10) NULL default 0,
  PRIMARY KEY (id)
);