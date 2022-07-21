const bcrypt = require('bcrypt')
const express = require('express');
const app = express();  
app.use("/images",express.static("uploads"));
const jwt = require("jsonwebtoken")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const fileUpload = require("express-fileupload");
const { createDB,getOrder, createColletion, insertProduct, getAllData, getData, updateData, deleteData, insertService, insertUser, userLogin,insertCustomer } = require("./models/DB")

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    // res.setHeader("Access-Control-Allow-Headers","Authorization");
    // if(req.path === "/" ||  req.path === "/products" || req.path === "/services" || req.path === "/login"){
    //     next();
    // }else{
    //     var reqToken =req.headers.authorization;
    // if(!reqToken){
    //     res.send([{error:"Please Provide Token"}])
    // }
    // console.log(reqToken);
    // jwt.verify(reqToken.split(" ")[1],"secret",(err,value)=>{
    //     if(err){
    //         res.send({error:"Failed To Authenticate Token"});
    //     }
    // })
    // next();
    // }
  next();
})
app.get('/', function (req, res) {
    res.send("Hello")
});
app.post('/product', fileUpload(), function (req, res) {
    let body = JSON.parse(req.body.data);
    let title = body.title;
    let des = body.des;
    let price = body.price;
    let random = new Date().getTime();
    let imageName = random + req.files.image.name;
    req.files.image.mv("./uploads/" + imageName);
    try {
        insertProduct(title, des, price, imageName, "one_click", "product");
        res.send({ message: "Product Created Successfully", status: true })
    } catch (e) {
        res.send({ message: "Somthing was wrong", status: false })
    }

    res.send({ message: "Hello", status: true });
})
app.get('/products', function (req, res) {
    try {
        getAllData("one_click", "product", res);

    } catch (e) {

    }
})

app.get('/db', function (req, res) {
    try {
        createDB("one_click");
        res.send("OK")
    } catch (e) { }

})
app.get('/collection', function (req, res) {
    try {
        createColletion("one_click", "orders");
        res.send("Collection created Successfully")
    } catch (e) {

    }
})
app.get('/products/:id', function (req, res) {
    try {
        getData("one_click", "product", req.params.id, res);
    } catch (e) {

    }
})
app.post('/products/:id', fileUpload(), function (req, res) {
    let body = JSON.parse(req.body.data);
    let title = body.title;
    let des = body.des;
    let price = body.price;

    let random = new Date().getTime();
    let image = random + "_" + req.files.image.name;
    req.files.image.mv("./uploads" + image);

    try {
        let update = {
            title: title,
            description: des,
            price: price,
            image: image
        }
        updateData("one_click", "product", req.params.id, update);
        res.send({ message: "Produt Updated Successfully", status: true });
    } catch (e) {
        res.send({ message: "Something Wrong", status: false });
    }
})
app.post('/products/:id/delete', fileUpload(), function (req, res) {
    var id = req.params.id;
    deleteData("one_click", "product", id);
    res.send({ message: "Product Deleted Successfully", status: true })
})
app.post('/service', fileUpload(), function (req, res) {
    let body = JSON.parse(req.body.data);
    let title = body.title;
    let des = body.des;

    let random = new Date().getTime();
    let imageName = random + req.files.image.name;
    req.files.image.mv("./uploads/" + imageName);
    try {
        insertService(title, des, imageName, "one_click", "service");
        res.send({ message: "Service Created Successfully", status: true })
    } catch (e) {
        res.send({ message: "Something was wrong", status: false })
    }

    res.send({ message: "Hello", status: true });
})
app.post('/services/:id', fileUpload(), function (req, res) {
    let body = JSON.parse(req.body.data);
    let title = body.title;
    let des = body.des;

    let random = new Date().getTime();
    let image = random + "_" + req.files.image.name;
    req.files.image.mv("./uploads" + image);

    try {
        let update = {
            title: title,
            description: des,
            image: image
        }
        updateData("one_click", "service", req.params.id, update);
        res.send({ message: "Service Updated Successfully", status: true });
    } catch (e) {
        res.send({ message: "Something Wrong", status: false });
    }
})
app.get('/services', function (req, res) {
    try {
        getAllData("one_click", "service", res);
    } catch (e) {
    }
})
app.get('/services/:id', function (req, res) {
    try {
        getData("one_click", "service", req.params.id, res);
    } catch (e) {

    }
})
app.post('/services/:id/delete', fileUpload(), function (req, res) {
    var id = req.params.id;
    deleteData("one_click", "service", id);
    res.send({ message: "Service Deleted Successfully", status: true })
})
app.post('/user', fileUpload(), function (req, res) {
    let body = JSON.parse(req.body.data);
    let username = body.username;
    let email = body.email;
    let password = body.password;
    bcrypt.hash(password, 10, (err, hash) => {
        try {
            insertUser(username, email, hash, "one_click", "users");
            res.send({ message: "User Created Successfully", status: true })
        } catch (e) {
            res.send({ message: "Something was wrong", status: false })
        }
    })


})
app.get('/users', function (req, res) {
    try {
        getAllData("one_click", "users", res);
    } catch (e) {
    }
})
app.post('/users/:id/delete', fileUpload(), function (req, res) {
    var id = req.params.id;
    deleteData("one_click", "users", id);
    res.send({ message: "User Deleted Successfully", status: true })
})
app.post('/login', fileUpload(), function (req, res) {
    let body = JSON.parse(req.body.data);
    let email = body.email;
    let password = body.password;
    try {
        userLogin(email, password, res, req)
    } catch (e) {

    }
})
app.post('/customer',fileUpload(),function(req,res){
    let body = JSON.parse(req.body.data);
    let reqBody = JSON.parse(req.body.cart);
    let cart = reqBody.order;
    let name = body.username;
    let phone = body.phone;
    try{
       insertCustomer(name,phone,cart,"one_click","customers")
    }catch(e){

    }
})
app.get('/customerlist', function (req, res) {
    try {
        getAllData("one_click", "customers", res);
    } catch (e) {
    }
})
app.get('/orderlist/:customerId',function(req,res){
getOrder("one_click","orders",req.params.customerId,res)
})
app.listen(8000, '127.0.0.1');