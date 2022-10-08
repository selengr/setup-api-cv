const jwt = require('jsonwebtoken');
const db = require('../../app/db/createDatabase');

const auth = (req, res, next) => {
    const token = req.headers?.authorization;

    if(! token ) {
        return res.status(403).json({ status: 'fail' , message : 'unauthorized'})
    }

    try {
        let decoded = jwt.verify(token, process.env.TOKEN_KEY);
        db.get(`SELECT * FROM users WHERE email = ?` , decoded.email , function(err, user) {
            
            if (err) {
                res.status(400).json({"error": err.message})
                return;
            }

            if(user.token != token) {
                return res.status(403).json({ status: 'fail' , message : 'unauthorized'})
            }

            const { id , name , email } = user;
            req.user = { id , name , email }
            next()
        });
    } catch(err) {
        return res.status(403).json({ status: 'fail' , message : 'unauthorized'})
    }
}


module.exports = auth;