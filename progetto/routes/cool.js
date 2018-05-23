var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:nome', function(req, res) {
  res.send('you are so cool '+req.params.nome);
});

module.exports = router;
