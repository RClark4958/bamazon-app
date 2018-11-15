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
        message: "Please enter the name of the product you would like to purchase." + "\n" + "[Q exits] " + "\n"
    }]).then(function(answer) {
        var correct = false;
        if (answer.choice.toUpperCase() == "Q"){
            process.exit();
        }
        for (var i = 0; i < res.length; i++){
            if (res[i].product_name.toUpperCase() == answer.choice.toUpperCase()) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quant",
                    message: "How many would you like to buy?",
                    validate: function(value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer) {
                    if ((res[id].stock_quantity - answer.quant) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.quant)+"' WHERE product_name='" + product + "'", function(err, res2) {
                            console.log("\n" + "Purchase Successful" + "\n");
                            makeTable();
                            console.log("Your total cost was $" + answer.quant * res[id].price + "\n"); 
                        })
                    } else {
                        console.log("Oops, we can't do that for you");
                        promptCustomer(res);
                    }
                })
            }
        }
        if (i==res.length && correct==false) {
            console.log("I'm sorry, I don't know what that is");
            promptCustomer(res);
        }
    })
}
