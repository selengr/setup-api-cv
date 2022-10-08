const express = require('express');
const router = express.Router();

const authMiddleware = require('./middlewares/auth')

const authRouter = require('./auth');
const usersRouter = require('./users');


/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ success : 'node shop api'});
});

/* GET home page. */
router.get('/user', authMiddleware , (req, res, next) => {
  res.json({ status : 'success' , user : req.user });
});

router.use('/auth' , authRouter);
router.use('/users' , usersRouter);

module.exports = router;
