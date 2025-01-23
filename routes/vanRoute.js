import express from 'express';
import Van from '../models/Van.js';

const router = express.Router();

router.get('/available', async (req, res) =>{
    try {
        const vans = await Van.find({})
        res.status(200).json(vans)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch vans', error: error.message });
    }



})

export default router;