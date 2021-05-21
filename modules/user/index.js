const express = require('express');
const router = express.Router();

router.post('/signup', (req, res) => {
    res.json({
        success: true, message: 'Sign up succesfully'
    })
});

module.exports = router;
