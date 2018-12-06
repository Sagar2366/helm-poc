const mongoose = require('mongoose');
const express = require("express");
const Joi = require('joi');
const app = express();
const monDb = 'mongodb://mongo:27017/blogDb';
const secretKeys = ["secretKey1", "secreteKey2", "secretKey3"];

const blogSchema = mongoose.Schema({
    timestamp:{type: Date,default: Date.now},
    title: {type:String, required:true},
    content: {type:String, required:true},
    author: {type:String, required:true}
});

const blogModel = mongoose.model('blogModel', blogSchema);


app.use(express.json());
app.use(function(req, res, next){
    if (secretKeys.indexOf(req.headers.client_secret) >= 0) next();
    else res.send("Provide valid applicatoin secret key");
})


app.get("/blog",function(req, res){
    blogModel.find(function(err, blogs){
        res.json(blogs);
    });
});


app.get("/blog/:id", function(req,res){
    blogModel.findById(req.params.id, function(err, result){
        if (err) return res.status(500).send(err);
        if (!result) return res.status(404).send("No blog found with given ID");
        res.send(result);
    })
});

app.post("/blog", function(req,res){
    const bodySchema = {
        title: Joi.string().min(1).required(),
        content: Joi.string().min(1).required(),
        author: Joi.string().min(1).required(),
    };
    const {error} = Joi.validate(req.body, bodySchema);
    if (error) return res.status(400).send(error.details[0].message);

    const blog = new blogModel(req.body);
    blog.save(err => {
        if (err) return res.status(500).send(err);
        res.status(201).send(blog);
    });
});


app.put("/blog/:id", function(req, res){
    
    const bodySchema = {
        title: Joi.string().min(1).optional(),
        content: Joi.string().min(1).optional()
    };
    const {error} = Joi.validate(req.body, bodySchema);
    if (error) return res.status(400).send(error.details[0].message);

    blogModel.findByIdAndUpdate(req.params.id, req.body, function(err, result){
        if (err) return res.status(500).send(err);
        if (!result) return res.status(404).send("No blog found with given ID");
        res.send(result);
    })
});

app.delete("/blog/:id", function(req, res){
    blogModel.findByIdAndRemove(req.params.id, function(err, result){
        if (err) return res.status(500).send(err);
        if (!result) return res.status(404).send("No blog found with given ID");
        res.send(result);
    })
});

mongoose.connect(monDb, { useNewUrlParser: true })
    .then(function(){
        app.listen(8099, () => {console.log("Listening on port 8099");});
    })
    .catch(function(err){console.log("Connection Failure.\n",err.message);});
