import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/past', async (req, res) =>{
    try {
        
        const userId = req.session.user?.id;
        const user = await User.findById({_id: userId});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const inactiveBookings = user.bookings.filter(booking => booking.status === 'inactive')
        
        res.status(200).json({bookings: inactiveBookings});
    } catch (error) {
        console.error('Error fetching inactive bookings:', error);
        res.status(600).json({message: "server error"})
    }


})

router.delete('/delete/:bookingId', async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const bookingId = req.params.bookingId;

        const user = await User.findById({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find and remove the booking
        const bookingIndex = user.bookings.findIndex(booking => booking._id.toString() === bookingId);

        if (bookingIndex === -1) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Remove the booking
        user.bookings.splice(bookingIndex, 1);
        await user.save();

        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;