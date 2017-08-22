var inquirer = require('inquirer');
var Table = require('console.table');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Christine507',
  database: 'bamazonDB'
});

  // connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
   });

//displays all of the products from the database
var data = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(data);
  })
}

var fetchProducts = function(callback) {
  return connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    return callback(res);
  })
}

var fetchProduct = function(itemId, callback) {
  return connection.query("SELECT * FROM products WHERE item_id = " + itemId, function(err, res) {
    if (err) throw err;
    console.log(res);
    return callback(res[0]);
  })
}

var updateProductQuantity = function(itemId, quantityPurchased) {
  return connection.query("UPDATE products SET stock_quantity = " + quantityPurchased + " WHERE item_id = " + itemId, function(err) {
    if (err) throw err;
  })
}

// constructor function used to create order objects
function Order(itemId, productName, stockQuantity, price) {
  this.itemId = itemId;
  this.productName = productName;
  this.stockQuantity = stockQuantity;
  this.price = price;
  this.printOrder = function() {
    console.log("ItemId: " + this.itemId + "\nproduct: " + this.productName + "\nquantity: " +
  this.stockQuantity + "\nprice: " + this.price);
  }
  this.purchase = function(quantityPurchased) {
    this.stockQuantity -= quantityPurchased;
    console.log(this.itemId)
    updateProductQuantity(this.itemId, this.stockQuantity);
  }
};


function displayProductsList(products) {
  products.map(function(product){
    console.log(product.item_id + ") " + product.product_name);
   })
}


function start() {
  var productItems;
  fetchProducts(function(data){
    productItems = data;
    displayProductsList(productItems);
    inquirer
    .prompt([
      {
      name: "itemId",
      type: "input",
      message: "Type the ID of the item you want to purchase: ",
       validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) >= 0) {
            return true;
          }
          return false;
        }
      },

  {
      name: "quantityPurchased",
      type: "input",
      message: "What quantity would you like to purchase today?",
       validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) >= 0) {
            return true;
          }
          return false;
        }
      }
    ]).then(function(answers) {
      // runs the constructor function order and places the order into the var new order
      // player. turns the offense and defense variables into integers as well with parseInt
      console.log(answers.itemId, answers.quantityPurchased);
      fetchProduct(answers.itemId, function(product){
        var order = new Order(answers.itemId, product.product_name, product.stock_quantity, product.price);
        order.purchase(answers.quantityPurchased);
        order.printOrder();
      })
      
     });

  });
  
}
start();
