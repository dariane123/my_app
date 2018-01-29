// *** Router Setting *** //
var express = require("express");
var path = require('path');
var app = express();

// *** DB Set *** //
var mongoose = require('mongoose');

// github https://github.com/dariane123/my_app.git
// *** mongodb CloudServer(AWS, GCP, Azure) mlab.com hosting connection *** //
// *** https://mlab.com/home *** //
// *** mongodb://<dbuser>:<dbpassword>@ds117878.mlab.com:17878/nodepj *** //
// mongoose.connect('mongodb://dariane:1234@ds117878.mlab.com:17878/nodepj');
mongoose.connect(process.env.MONGO_DB); // DB Connect Info Security ( github master )
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB Connected");
});
db.on("error", function(err){
  console.log("DB Error : ", err);
});

// *** Schema Set *** //
var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});

var Data = mongoose.model('data', dataSchema);

Data.findOne({name:"myData"}, function (err,data){
  if(err) return console.log("Data ERROR : ", err);
  if(data) {
    Data.create({name:"myData",count:0}, function (err, data) {
      if(err) return console.log("Data ERROR : ", err);
      console.log("Counter initialized : ", data);
    });
  }
});

// *** DOM ejs Render *** //
app.set("view engine", 'ejs');
// *** dynamicWeb Set *** //
app.use(express.static(path.join(__dirname, 'public'))); // directory => C:\Users\JJM\documents\workspace\newapp

// *** Router Set *** //
// Mapping
app.get('/', function (req, res) { // http://localhost:3000/ => count 1
  Data.findOne({name:"myData"}, function(err,data){
    if(err) return console.log("Data ERROR : ", err);
    data.count++;
    data.save(function (err) {
      if(err) return console.log("Data ERROR : ", err);
      res.render("my_first_ejs", data);
    });
  });
});
app.get('/reset', function(req, res) { // http://localhost:3000/reset => count 0
  setCounter(res, 0);
});
app.get('/set/count', function(req, res) { // http://localhost:3000/set/count?count=100 => count 100
  if(req.query.count) setCounter(res, req.query.count);
  else getCounter(res);
});
app.get('/set/:num', function(req, res) { // http://localhost:3000/set/111 => count 111
  if(req.params.num) setCounter(res, req.params.num);
  else getCounter(res);
});


function setCounter(res, num) {
  console.log("setCounter");
  Data.findOne({name:"myData"}, function(err,data){
    if(err) return console.log("Data ERROR : ", err);
    data.count = num;
    data.save(function (err) {
      if(err) return console.log("Data ERROR : ", err);
      res.render("my_first_ejs", data);
    });
  });
}
function getCounter(res) {
  console.log("getCounter");
  Data.findOne({name:"myData"}, function(err,data){
    if(err) return console.log("Data ERROR : ", err);
    res.render("my_first_ejs", data);
  });
}




// *** webServer localhost *** //
app.listen(3000, function(){
  console.log("Server On!");
});
