import express from 'express';
import Tour from '../models/Tour.js';

const router = express.Router();

router.get('/available', async(req, res) =>{

    try{
        const availableTours = await Tour.find({});
        res.status(200).json(availableTours);

    }
    catch(error){
        res.status(500).json({message: 'Error fetching tours: ', error})
    }


})

export default router;