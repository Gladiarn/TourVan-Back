import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();
const saltRounds = 10;

//route for register
router.post('/register', async(req, res) =>{
    const {email, name, password} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = new User({email, name, password: hashedPassword});

        await newUser.save();
        res.status(201).json({message: 'User registered successfully', user: newUser})


    }
    catch(error){
        res.status(500).json({message: 'Error registering User', error: error.message})
    }

})

export default router;