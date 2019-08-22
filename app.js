const express= require('express');
var bodyParser = require('body-parser');
const Mongoose = require("mongoose");
var request = require('request');

var app=express();
let Schema=Mongoose.Schema;

const studentSchema = new Schema({
    name : String,
    roll_no : String,
    class :  String
  })

var StudentModel = Mongoose.model('students', studentSchema);

const markSchema = new Schema({
    student : {
      type : Mongoose.Schema.Types.ObjectId,
      ref : 'students'
    },
    mark_physics : String,
    mark_chemistry : String,
    mark_biology : String
  })
  

var markModel = Mongoose.model('marks', markSchema);





app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//mongodb+srv://anishsnair:<password>@cluster0-rqfpy.mongodb.net/test?retryWrites=true&w=majority
Mongoose.connect("mongodb://localhost/anish");
//Mongoose.connect("mongodb+srv://anishsnair:hello12345@cluster0-rqfpy.mongodb.net/test?retryWrites=true&w=majority");


app.get("/getmarks", async (request, response) => {
    let result = await markModel.find().populate('student')
    response.send(result)
});

app.get("/getstudents", async (request, response) => {
    try {
        var result = await StudentModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/addmarks", async (req,res)=>{
    let _mark = new markModel({
        student : req.body.student_id,
        mark_physics : req.body.mark_physics,
        mark_biology : req.body.mark_biology,
        mark_chemistry : req.body.mark_chemistry,
      })
      let result = await _mark.save()
      res.send(result)
})


app.post("/addstudents",async (req,res)=>{
    let _student = new StudentModel({
        name : req.body.name,
        roll_no : req.body.roll_no,
        class : req.body.class
      })
      let result = await _student.save()
      res.send(result)
})




app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});