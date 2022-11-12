const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const yup = require("yup");
const { createToken } = require('../app/services/token');
const userRepo = require('../app/db/repos/user');
const validate = require('./middlewares/validate');
const phoneVerifyRepo = require('../app/db/repos/phoneVerify');
const phoneVerify = require('../app/db/repos/phoneVerify');
const phoneRegExp = /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/

const loginSchema = yup.object({
    body : yup.object({
        phone : yup.string().required().matches(phoneRegExp, 'Phone number is not valid')
            .test('check-phone-exists' , 'the phone not exists' , async (value) => {
                let user = await userRepo.findBy('phone' , value)
                return user !== undefined;
            })
    })
})

/* GET users listing. */
router.post('/login', validate(loginSchema)  , async (req, res, next) => {
    try {      
        const { phone } = req.body;
               
        let user = await userRepo.findBy('phone' , phone);

        let phoneVerifyData = {
            'id' : crypto.randomUUID(),
            'phone' : user.phone,
            'code' : await phoneVerifyRepo.getUniqueCode(),
        }

        console.log(phoneVerifyData)

        try {
            await phoneVerifyRepo.create(phoneVerifyData);
        } catch (error) {
            return res.status(500).json({
                'status' : 'error',
                'message' : 'we cant create phone verify code'
            })
        }

        return res.status(200).json({
            'status' : 'success',
            'token' : phoneVerifyData.id,
        });

    } catch (err) {
        next(err);
    }   
});


const loginStepTwoSchema = yup.object({
    body : yup.object({
        token : yup.string().required()
            .test('check-token-exists' , 'the token not exists' , async (value) => {
                let phoneVerify = phoneVerifyRepo.findBy('id' , value);
                return phoneVerify !== undefined;
            }),
        code : yup.string().required()
                .test('check-code-right' , 'the code is not correct' , async (value, { parent }) => {
                    let phoneVerify = await phoneVerifyRepo.findBy('id' , parent?.token);
                    console.log(phoneVerify)
                    return phoneVerify?.code === value;
                })
    })
})

/* GET users listing. */
router.post('/login/verify-phone', validate(loginStepTwoSchema)  , async (req, res, next) => {
    try {      
        const { phone ,token } = req.body;
        
        let phoneVerify = await phoneVerifyRepo.findBy('id' , token);
        let user = await userRepo.findBy('phone' , phoneVerify.phone);

        // * CREATE JWT TOKEN
        const tokenJWT = createToken({ user_id: user.Id, name: user.name, phone })
        user.token = tokenJWT;
        await userRepo.update(user.id , { token : tokenJWT });

        await phoneVerifyRepo.delete(phoneVerify.id);
    
        return res.status(200).json({
            'status' : 'success',
            user
        });

    } catch (err) {
        next(err);
    }   
});


const registerSchema = yup.object({
    body : yup.object({
        name : yup.string().required().min(2),
        phone : yup.string().required().matches(phoneRegExp, 'Phone number is not valid')
                .test('check-phone-exists' , 'the phone is already exists' , async (value) => {
                    let user = await userRepo.findBy('phone' , value)
                    return user === undefined;
                })

    })
})

router.post('/register', validate(registerSchema) , async (req, res, next) => {

    try {
        const { name, phone } = req.body;


        let data = {
            name,
            phone,
            created_at: Date.now()
        }

        await userRepo.create(data);

        return res.status(201).json({ status : 'success' });  
        
    } catch (err) {
      next(err);
    }
});

module.exports = router;