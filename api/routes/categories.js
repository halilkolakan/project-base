var express = require('express');
var router = express.Router();

const isAuthhrnticated = true;

router.all("*", (req, res, next) => {
    if (isAuthhrnticated){
        next();
    }else{
        res.json({success: false, error: "Not authhrnticated"})
    }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({success: true});
});

module.exports = router;
