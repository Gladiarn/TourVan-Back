import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/login', async (req, res) =>{

    const { email, password} = req.body;

    try{
        const user =  await User.findOne({ email });
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({message: 'Invalid password'});
        } 

        req.session.user = {id: user._id ,name: user.name, email: user.email};

        res.cookie('name', user.name, {httpOnly: false, secure: false, sameSite: 'lax'});
        res.cookie('email', user.email, { httpOnly: false, secure: false, sameSite: 'lax' });
        res.cookie('userType', user.userType, { httpOnly: false, secure: false, sameSite: 'lax' });

        res.status(200).json({message: 'Login Successful: ', user: { name: user.name, email: user.email }});

    }
    catch(error){
        res.status(500).json({message: 'Server Error', error});
    }
});

export default router