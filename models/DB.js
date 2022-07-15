const mongodb = require("mongodb");
const mongodbClient = mongodb.MongoClient;
const url ="mongodb://localhost:27017/";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


function createDB(dbName){
    try{
        mongodbClient.connect(url+dbName,function(err,db){
            if(err){  throw err;}
        })
    }catch(e){

    }
}
function createColletion(dbName,collName){
    mongodbClient.connect(url,function(err,db){
        if(err){throw err;}
        var dbo = db.db(dbName);
        dbo.createCollection(collName,function(err,res){
            if(err){throw err;}
            db.close();
            console.log("Success")
        })
    })
}
function insertProduct(title,des,price,image,dbName,collName){
    mongodbClient.connect(url,function(err,db){
        if(err){throw err}
        var dbo = db.db(dbName);
        var data ={
            title:title,
            description:des,
            image:image,
            price:price
        }
        dbo.collection(collName).insertOne(data,function(err,res){
            if(err){throw err};
        })
    })
}
function insertService(title,des,image,dbName,collName){
 mongodbClient.connect(url,function(err,db){
    if(err){throw err};
    var dbo = db.db(dbName);
    var data ={
        title:title,
        description:des,
        image:image,
    }
    dbo.collection(collName).insertOne(data,function(err,response){
        if(err){throw err} 
    })
 })
}
function insertUser(username,email,password,dbName,collName){
    mongodbClient.connect(url,function(err,db){
        if(err){throw err}
        var dbo = db.db(dbName);
        var data ={
            username:username,
            email:email,
            password:password,
        }
        dbo.collection(collName).insertOne(data,function(err,res){
            if(err){throw err};
        })
    })
}
function getAllData(dbName,collName,res){
    mongodbClient.connect(url,function(err,db){
        if(err){throw err;}
          var dbo = db.db(dbName);
          dbo.collection(collName).find({}).toArray(function(err,result){
            if(err){throw err};
            res.send(result);
          })
    })
}
function getData(dbName,collName,id,response){
    mongodbClient.connect(url,function(err,db){
        if(err){throw err};
        var dbo = db.db(dbName);
        dbo.collection(collName).find({_id:mongodb.ObjectId(id)}).toArray(function(err,result){
            if(err){throw err};
            response.send(result);
        })

    })
}
function updateData(dbName,collName,id,newUpdate){
    mongodbClient.connect(url,function(err,db){
        if(err){throw err};
        var dbo = db.db(dbName);
        var query = {_id:mongodb.ObjectId(id)};
        var newData = {$set: newUpdate};

        dbo.collection(collName).updateOne(query,newData,function(err,result){
            if(err){throw err};
        })
    })
}
function deleteData(dbName,collName,id){
    mongodbClient.connect(url,function(err,db){
        if(err){throw err};
        var dbo =db.db(dbName);
        var query ={_id:mongodb.ObjectId(id)};
        dbo.collection(collName).deleteOne(query,function(err,result){
            if(err){throw err};
        })
    })
}
function userLogin(email,password,res,req){
    mongodbClient.connect(url,function(err,db){
        if(err){throw err};
        var dbo =db.db("one_click");
        dbo.collection('users').find({email: email}).toArray(function(err,result){
            if(err){throw err};
            // console.log(result);
            bcrypt.compare(password,result[0].password,function(err,response){
                if(response === true){
                    var tok=   jwt.sign({data:{email:email,password:result[0].password}},"secret")
                    res.send({status:true,message:"Login Successfully",token:tok})
                }else{ 
                    res.send({status:false,message:"Username and Password Invalid"})}
            })

        })
    })
}
module.exports={createDB,createColletion,insertProduct,getAllData,getData,updateData,deleteData,insertService,insertUser,userLogin};