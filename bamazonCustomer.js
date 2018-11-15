var mysql = require("mysql");
var inquirer = require("inquirer");
var dotenv = require("dotenv").config();

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.SQL_PASSWORD,
    database: "bamazon"
})

connection.connect(function(err){
    if (err) throw err;
    console.log("connection successful");
});



