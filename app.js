// *** import modules *** //
var express = require("express");
var path = require('path');
var app = express();
var mongoose = require('mongoose'); // db set
var bodyParser = require('body-parser'); // http header body


// github https://github.com/dariane123/my_app.git
// *** site => https://mlab.com/home /// mongodb CloudServer(AWS, GCP, Azure) mlab.com hosting connection *** //
// *** mongodb://<dbuser>:<dbpassword>@ds117878.mlab.com:17878/nodepj *** //
<<<<<<< HEAD
// mongoose.connect('mongodb://dariane:1234@ds117878.mlab.com:17878/nodepj');
// *** connection database *** //
=======
>>>>>>> 47f92a6db1d6ead849c5854fe2000080e2b23209
mongoose.connect(process.env.MONGO_DB); // DB Connect Info Security ( github master )
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB Connected");
});
db.on("error", function(err){
  console.log("DB Error : ", err);
});


/*
 * Database : collection 들의 집합
 * Collection : 하나의 데이터베이스 셋 ( SQL의 테이블개념 )
 * Document : 하나의정보, 혹은 여러개의 정보를 담고있는 하나의 object 이거나 array.
 *            SQL 컬럼과 유사하며, object나 array를 담을수있어 기존의 SQL과는 차별화됨
 */
// *** model set *** //
var postSchema = mongoose.Schema({
  title: {type:String, required:true}, // 제목
  body: {type:String, required:true}, // 본문
  createdAt: {type:Date, default:Date.now}, // 생성시간
  updatedAt: Date // 수정시간
});
var Post = mongoose.model('post',postSchema); // model을 담는변수 첫글자는 대문자
/*
 * mongoose.model 함수는 두개의 인자를 받으며,
 * 첫번째 인자는 문자열의 데이터베이스에
 * 연결될 collection의 단수 (singular) 이름이고,
 * 두번째 인자는 mongoose.Schema 함수로
 * 생성된 스키마변수
 * ※ 모델이름은 항상 단수이고, collection의 이름은 항상 복수이다
 *
 *
 * mongoose.model function reference /// site - http://mongoosejs.com/docs/api.html
 * findOne(obj, callback) : ojb 인자로 넘겨받은 오브젝트에 해당하는 데이터를 하나찾는다.
 *                          해당하는 데이터가 하나이상일경우 사용하지않는것이 좋다.
 *                          callback 함수로 넘겨지는 데이터는 하나의 obj
 * find(obj, callback) : obj에 해당하는 데이터를 모두 찾는다.
 *                       callback 함수로 넘겨지는 데이터는 array ( 결과값이 하나여도 array )
 * create(obj, callback) : 오브젝트 데이터중에 schema와 일치하는 데이터들만 모아 새로운 데이터를 만든다.
 * findOneAndUpdate(obj1, obj2, callback) : obj1에 해당하는 데이터를 찾아 obj2로 교체한다.
 * findOneAndRemove(obj, callback) : obj에 해당하는 데이터를 하나 찾아 지워버리는 함수
 */


// *** view set *** //
app.set("view engine", 'ejs');

// *** middlewares set *** //
app.use(express.static(path.join(__dirname, 'public'))); // directory => C:\Users\JJM\documents\workspace\newapp
app.use(bodyParser.json());


// *** Router Set / Mapping *** //
/*
 * HTTP Action (DB Connect API)
 * View O : DB conn O - Index : 데이터베이스에서 해당 모델의 모든 자료를 가져와서 표시. (GET)
 * View O : DB conn O - Show : 데이터베이스에서 해당 아이디의 자료를 가져와서 표시. (GET)
 * View O : DB conn X - New : create 액션을 수행하기 위해 사용자로 부터 데이터를 입력받을 폼을 제공 (GET)
 * View X : DB conn O - Create : new의 폼의 데이터를 사용하여 데이터베이스에 자료를 생성 (POST)
 * View O : DB conn X - Edit : update 액션을 수정하기 위해 사용자로부터 데이터를 입력받을 폼을 제공 (GET)
 * View X : DB conn O - Update : edit의 폼의 데이터를 사용하여 데이터베이스에 자료를 수정 (PUT/PATCH)
 * View X : DB conn O - Destory : 데이터베이스에서 해당 아이디의 자료를 삭제한다. (DELETE)
 */
app.get('/posts', function(req,res) {
  Post.find({}, function(err,posts) {
    if(err) return res.json({success:false, massage:err});
    res.json({success:true, data:posts});
  });
}); // Index

app.post('/posts', function(req,res) {
  Post.create(req.body.post, function(err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
}); // create

app.get('/posts/:id', function(req,res) {
  Post.findById(req.params.id, function (err,post) {
      if(err) return res.json({success:false, message:err});
      res.json({success:true, data:post});
  });
}); // show

app.put('/posts/:id', function(req,res) {
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id + " updated"});
  });
}); // update

app.delete('/posts/:id', function(req,res) {
  Post.findByIdAndRemove(req.params.id, function(err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id + " deleted"});
  });
}); // delete

// _id : 5a6ed70091e5103b94a0bbed

// *** webServer localhost *** //
app.listen(3000, function(){
  console.log("Server On!");
});
