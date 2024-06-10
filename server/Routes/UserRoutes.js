const { email } = require('../Controller/UserController');

const router = require('express').Router();

router.post('/send', email);

module.exports = router;