import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/current', async (req, res) =>{
    try {
        
        const userId = req.session.user?.id;
        const user = await User.findById({_id: userId});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const activeBookings = user.bookings.filter(booking => booking.status === 'active')
        
        res.status(200).json({bookings: activeBookings});
    } catch (error) {
        console.error('Error fetching active bookings:', error);
        res.status(600).json({message: "server error"})
    }


})

export default router;