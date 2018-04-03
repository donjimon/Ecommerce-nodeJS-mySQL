var mysql = require ("mysql");
var inquirer = require ("inquirer");
// ask about mysql.createConnection().query() - is query an function object nested inside createconnection?
var connection = mysql.createConnection({
    host : "localhost",
    port: 3306,
    user: "root",
    password: "20thang8",
    database: "Ecommerce"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as ID" + connection.threadId)
    managingStore();
});

function managingStore (){
    inquirer.prompt({
        name:"action",
        type:"list",
        message:"what would you like to do?",
        choices:[
            "add items to inventory",
            "take out items from inventory",
            "view report by department"
        ]
    }).then(function(answer){
        switch (answer.action){
            case "add items to inventory":
                addItems();
                break;
            // case "take out items from inventory":
            //     takeOutItems();
            //     break;
            case "view report by department":
                viewReport();
                break
            
        }    
       
    })
};

function viewReport(){
    inquirer.prompt({
        name:"action",
        type:"list",
        message: "Sort by?",
        choices: [
            "view by brands",
            "view by price tier",
        ]
    }).then(function(answer){
        switch(answer.action){
            case "view by brands":
                viewByBrands();
                break;
            case "view by price tier":
                viewByPriceTier()
                break;
        }
    });
   
};

function viewByBrands(){
    connection.query("SELECT brand_name, inventory FROM brands ", function(err,res){
        if (err) throw err;
        var showBrands = [];
        var row = "";
        for (var i = 0; i< res.length; i++){
                row = "there are " + res[i].inventory + " " + res[i].brand_name;
                showBrands.push(row);  
        }  
        inquirer.prompt({
            name:"action",
            type:"list",
            message:"click for details",
            choices: showBrands
        }).then(function(answer){
            connection.query("SELECT guitars.item_name, brands.brand_name FROM guitars LEFT JOIN brands ON brands.id = guitars.brand",
            function(err,res){
                if (err) throw err; 
                var showItems = [];
                for (var i = 0; i < res.length; i++) {
                    if (answer.action.charAt(12) === res[i].brand_name.charAt(0) && answer.action.charAt(13) === res[i].brand_name.charAt(1))
                        {
                            console.log(JSON.parse(JSON.stringify(res[i])));
                        }        
                }      
            })
        })

    })
}
function viewByPriceTier (){
    connection.query("SELECT category, inventory FROM guitar_category ", function(err,res){
        if (err) throw err;
        var showTier = [];
        var row = "";
        for (var i = 0; i< res.length; i++){
            row = "there are " + res[i].inventory + " " + res[i].category;
            showTier.push(row);  
        }  
        inquirer.prompt({
            name:"action",
            type:"list",
            message:"click for details",
            choices: showTier
        }).then(function(answer){
            connection.query("SELECT guitars.item_name, brands.brand_name, guitar_category.category, guitars.net_price, guitars.list_price FROM guitars LEFT JOIN brands ON brands.id = guitars.brand LEFT JOIN guitar_category ON guitar_category.id = guitars.category",
            function(err,res){
                if (err) throw err; 
                var showItems = [];
                for (var i = 0; i < res.length; i++) {
                    if (answer.action.charAt(12) === res[i].category.charAt(0) && answer.action.charAt(14) === res[i].category.charAt(2))
                        {
                           console.log(JSON.parse(JSON.stringify(res[i])));
                        }        
                }      
            })
        })

    })
};

function addItems(){
    inquirer.prompt([
    {
        name:"name",
        type:"input",
        message:"what's the name?"
    },
    {
        name:"brand",
        type:"input",
        message:"what's the brand?"
    },
    {
        name:"priceTier",
        type:"input",
        message:"what's the price tier?"
    },
    {
        name:"netPrice",
        type:"input",
        message:"what is the net price?",
    },
    {
        name:"listPrice",
        type:"input",
        message:"what is the list price?"
    }
    ]).then(function(answer){
        var newItem;
        firstUpdate().then(() => {
            connection.query("SELECT id, category FROM guitar_category",function(err,res){
                if(err) throw err;
                res.forEach(function(element){
                    if (element.category === answer.priceTier){
                        connection.query("UPDATE guitar_category SET inventory = inventory + 1 WHERE id=" + element.id);
                        connection.query("UPDATE guitars SET ? WHERE ?",[{category: element.id}, {id: newItem}]);
                        console.log(newItem);
                    }
                });
            });
        });
        function updateGuitars(brandId){
            connection.query ("INSERT INTO guitars SET ?", 
                                {
                                    item_name: answer.name, 
                                    brand: brandId,
                                    net_price: answer.netPrice,
                                    list_price: answer.listPrice
                                },
                function(err,res){
                    if (err) throw error;
                    newItem = res.insertId;
                    console.log(newItem);
                });                         
        };  
        
        async function firstUpdate() {
            connection.query("SELECT id, brand_name FROM brands",function(err,res){
                var counter = res.length;
                var match = false;
                res.forEach(function(element){
                    if (element.brand_name === answer.brand){
                        connection.query("UPDATE brands SET inventory = inventory + 1 WHERE id=" + element.id);
                        updateGuitars(element.id);
                        match = true;
                        console.log("update existing one");
                        } 
                    else {counter--;};
                    if (counter === 0 && match === false){
                        connection.query("INSERT INTO brands SET ?",{brand_name: answer.brand, inventory: 1},function(err,res){
                            if(err) throw err;
                            updateGuitars(res.insertId);  
                            console.log("update new one");                  
                        })
                    }
                });
            });
        };
         
    })
};

