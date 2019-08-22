const express=require('express');
var bodyParser = require('body-parser');
const Mongoose = require("mongoose");
var request = require('request');

var app=express();
let Schema=Mongoose.Schema;

var studentSchema = new Schema({
    firstname: {type: String },
    lastname: {type: String },
    admno:{type: String }
});

var StudentModel = Mongoose.model('studentdetails', studentSchema);

var markSchema = new Schema({
    studentid:{type:Mongoose.Schema.Types.ObjectId,ref: 'studentdetails'},
    markObtained:{type:Number},
    totalMark:{type:Number}
//   name:  String,
//   taxDetails: [{ type: Schema.Types.ObjectId, ref: 'taxDetail' }]
});

var markModel = Mongoose.model('marks', markSchema);


// const StudentModel = Mongoose.model("studentdetails", {
//     firstname: {type: String },
//     lastname: {type: String },
//     admno:{type: String }
// });
// const markModel = Mongoose.model("marks",{
//     studentid:{type:Mongoose.Schema.Types.ObjectId,ref: 'studentdetails'},
//     markObtained:{type:Number},
//     totalMark:{type:Number}

// })


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//mongodb+srv://anishsnair:<password>@cluster0-rqfpy.mongodb.net/test?retryWrites=true&w=majority
Mongoose.connect("mongodb://localhost/newTestCollegeDb");
//Mongoose.connect("mongodb+srv://anishsnair:hello12345@cluster0-rqfpy.mongodb.net/test?retryWrites=true&w=majority");


app.get("/getmarks", async (request, response) => {
    try {
        var result = await markModel.find({}).populate('studentdetails');
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/getstudents", async (request, response) => {
    try {
        var result = await StudentModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/addstudents",(req,res)=>{
    try {
        var person = new StudentModel(req.body);
        var result =  person.save(result,(error,data)=>{
            if(error){ throw error;}
            res.send(data);
        } );
       
    } catch (error) {
        res.status(500).send(error);
    }
})


app.post("/addmarks",(req,res)=>{
    try {
        var person = new markModel(req.body);
        var result =  person.save(result,(error,data)=>{
            if(error){ throw error;}
            res.send(data);
        } );
       
    } catch (error) {
        res.status(500).send(error);
    }
})




app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});