const express = require('express');
const bodyparser = require('body-parser');
const {ObjectID} = require('mongodb');
const mongoose = require('mongoose');

//Connecting to mongodb server
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://mongo5:27017/contacts',{useNewUrlParser : true});


//creating mongoose model
var Contacts = mongoose.model('Contacts',{
    PersonName :{
        type : String,
        require : true,
        maxlength : 10
    },
    MobileNumber : {
        type : Number,
        require : true,
        minlength : 10,
        maxlength : 10
    }
    });

var app = express();

const PORT = process.env.PORT || 5066;

app.use(bodyparser.json());

//List all contacts
app.get('/getcontacts',(req,res) => {
Contacts.find().then((contacts)=>{
//    res.send({contacts});
    res.json(contacts);
}, (error) => {
    res.status(400).send(error);
});
});


//get contcats by id
app.get('/getcontacts/:id', (req,res) => {
    var id= req.params.id;
    Contcats.findById(id).then( (result) => {
//        res.send(result);
	res.json(result);
    }, (error) => {
        res.send(error);
    })
});

//Creating new contacts
app.post('/createcontacts', (req,res) => {

    var contacts = new Contacts(req.body);
    contacts.save().then((doc) => {
//        res.send(doc);
	res.json(doc);
    },(err) => {
        res.send(err);
    });
});

//remove contacts by id
app.delete('/blogcontacts/:id',(req,res) => {
    var id = req.params.id;
    Contacts.findByIdAndRemove(id).then((result) => {
//        res.send(result);
        res.json(result);
    }, (error) => {
        res.send(error);
    });
});


//Update contacts with id
app.patch('/updatecontacts/:id',(req,res) => {
    var id = req.params.id;
    Contcats.findByIdAndUpdate(id,{$set:req.body},{new:true}).then((result)=> {
  //      res.send(result);
	res.json(result);
    },(error)=> {
        res.send(error);
    })
})

app.listen(PORT,() => {
console.log(`Contact application is running on port ${PORT}`);
});
