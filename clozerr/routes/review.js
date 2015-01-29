var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Schema = mongoose.Schema;
var models = require('./models');
var Review = models.Review;
var error = require("./error");
var _ = require('underscore');
router.get('/create', function (req, res) {

    // TODO: Need to check if accessing user is the same as the one who checked in.
    var checkin_id = req.query.checkin_id;
    var stars = req.query.stars;
    var remarks = req.query.remarks;
    console.log( stars );
    console.log( remarks );
    var dateCreated = new Date();

    var review = new Review({
        checkinid: checkin_id,
        date_created: dateCreated,
        stars: stars,
        remarks: remarks
    });

    res.send( JSON.stringify( { result:true, data:review } ) );
    review.save(function (err) {
        if (err) console.log(err);
    })
});
router.get('/get',function(req,res){
    var errobj = error.err_insuff_params(res, req, ["review_id"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }

    var id = req.query.review_id;

    Review.findOne({
        _id: id
    }, function (err, data) {
        if (err) console.log(err);
        if (data) {

            res.send(JSON.stringify({
                    result:true,
                    data:data
                }));

            res.end();
        } else {
            error.err(res, "210");
            res.end();
        }
    })
});
 module.exports = router;
