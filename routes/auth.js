const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const yup = require("yup");
const { createToken } = require('../app/services/token');
const userRepo = require('../app/db/repos/user');
const validate = require('./middlewares/validate');

const loginSchema = yup.object({
    body : yup.object({
        email : yup.string().required().email()
            .test('check-email-exists' , 'the email not exists' , async (value) => {
                let user = await userRepo.findBy('email' , value)
                return user !== undefined;
            }),
        password : yup.string().min(8)
    })
})

/* GET users listing. */
router.post('/login', validate(loginSchema)  , async (req, res, next) => {
    try {      
        const { email, password } = req.body;
               
        let user = await userRepo.findBy('email' , email);
        if(user) {
            if(bcrypt.hashSync(password, user.salt) === user.password) {
                // * CREATE JWT TOKEN
                const token = createToken({ user_id: user.Id, name: user.name, email })
        
                user.token = token;

                await userRepo.update(user.id , { token })
                
                return res.status(200).send(user);
            }
        } else {
            return res.status(400).send("No Match");          
        }    
    } catch (err) {
        next(err);
    }   
});

const registerSchema = yup.object({
    body : yup.object({
        name : yup.string().required().min(2),
        email : yup.string().required().email()
                .test('unique-email' , 'user already exists. please login' , async (value) => {
                    let user = await userRepo.findBy('email' , value)
                    return user === undefined;
                }),
        password : yup.string().required().min(8)
    })
})

router.post('/register', validate(registerSchema) , async (req, res, next) => {

    try {
        const { name, email, password } = req.body;

        let salt = bcrypt.genSaltSync(10);

        let data = {
            name: name,
            email: email,
            password: bcrypt.hashSync(password, salt),
            salt,
            created_at: Date.now()
        }

        await userRepo.create(data);

        return res.status(201).json({ status : 'success' });  
        
    } catch (err) {
      next(err);
    }
});

module.exports = router;