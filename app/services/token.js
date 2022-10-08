const jwt = require('jsonwebtoken');


const createToken = (data , expiresIn = "1h") => {
    return jwt.sign(
        data,
        process.env.TOKEN_KEY,
        {
            expiresIn, // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
        }  
    );
}



module.exports = { createToken }