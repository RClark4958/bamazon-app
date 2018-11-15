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
    makeTable();
}) 

var makeTable = function() {
    connection.query("SELECT * FROM products", function(err, res){
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " || " + res[i].product_name + " || " + res[i].department_id + " || " + res[i].price + " || " + res[i].stock_quantity + "\n");
        }
    promptCustomer(res);
    })
}

var promptCustomer = function(res) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'What would you like to buy? *Exit with Q*'
    }]).then(function(answer) {
        var correct = false;
        for (var i = 0; i < res.length; i++){
            if(res[i].product_name==answer.choice) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quant",
                    message: "How many would you like to buy?",
                    validate: function(value) {
                        if(isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer) {
                    if((res[id].stock_quantity - answer.quant) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.quant)+"' WHERE product_name='" + product + "'", function(err, res2) {
                            console.log("Purchase Successful");
                            makeTable(); 
                        })
                    } else {
                        console.log("Oops, we can't do that for you");
                        promptCustomer(res);
                    }
                })
            }
        }
    })
}
