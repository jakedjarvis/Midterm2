var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/commentDB', {useMongoClient:true});
var storeSchema = mongoose.Schema({
    Name:String,
    Price:Number,
    Amount:Number,
    URL:String
});
storeSchema.methods.incrementAmount = function(cb) {
    this.Amount += 1;
    this.save(cb);
};

var store = mongoose.model('store', storeSchema);

var db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error:'));
db.once('open', function() {
    console.log("Connected to db");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/admin', function(req,res,next) {
    console.log("In admin get");

    store.find(function(err,productList) {
        if (err) return console.error(err);
        else{
            console.log(productList);

            res.json(productList);
        }
    })
});

router.get('/voter', function(req,res,next) {
    console.log("In voter get");

    store.find(function(err,productList) {
        if (err) return console.error(err);
        else{
            console.log(productList);

            res.json(productList);
        }
    })
});

router.post('/admin', function(req, res, next) {
    console.log("In admin post");
    console.log(req.body);

    var newProduct = new store(req.body);

    newProduct.save(function(err,post) {
        if(err) return console.error(err);

        console.log(post);
        res.sendStatus(200);
    });
});

router.param('product', function(req, res, next, id) {
    console.log("In param");

    var query = store.findById(id);
    query.exec(function(err, product){
        if (err) {return next(err);}
        if (!product) {return next(new Error("Can't find product"));}
        req.product = product;

        console.log("Leaving param");

        return next();
    });
});

router.get('/admin/:product', function(req, res) {
    res.json(req.json);
});

router.get('/voter/:product', function(req,res) {
    res.json(req.json);
});

router.delete('/admin/:product', function(req, res) {
    console.log("In delete for /admin/:product");
    console.log(req.product);
    store.find(req.product).remove().exec(function(err, data){
        if(err) {return console.error(err)}
        res.sendStatus(200);
    })

});

router.put('/admin/:product/incrementAmount', function(req, res, next) {
    req.product.incrementAmount(function(err,product) {
        if(err) {return next(err);}
        res.json(product);
    });
});

module.exports = router;
