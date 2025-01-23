import express from 'express';
import Tour from '../models/Tour.js';

const router = express.Router();

router.get('/promo', async(req, res) =>{

    try{
        const promoTours = await Tour.find({ isPromo: true });
        res.status(200).json(promoTours);

    }
    catch(error){
        res.status(500).json({message: 'Error fetching tours with promos: ', error})
    }


})

export default router;