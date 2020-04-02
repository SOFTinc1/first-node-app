var bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
    express             = require("express"),
    app                 = express();


// APP CONFIG
mongoose.connect("mongodb://localhost/tnm_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));




// MONGOOSE/MODEL CONFIG

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Bloging", blogSchema); 


// ROUTES

app.get("/", function(req, res){
    res.redirect("/index"); 
});

// INDEX ROUTE

app.get("/index", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/index/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE

app.post("/index", function(req, res){
Blog.create(req.body.blog, function(err, newBlog){
    if(err){
        res.render("new");
    } else {
        res.redirect("/index");
    }
});
});


// SHOW ROUTE

app.get("/index/:id", function(req, res){

   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/index");
       } else {
           res.render("show", {blog: foundBlog});
       }
   });
});

// EDIT ROUTE

app.get("/index/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/index");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE

app.put("/index/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/index");
      }  else {
          res.redirect("/index/" + req.params.id);
      }
    });
});

// DELETE ROUTE
app.delete("/index/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/index");
        } else {
            res.redirect("/index");
        }
    });
});


app.listen(3000, function(){
    console.log("SERVER IS RUNNING!");
});