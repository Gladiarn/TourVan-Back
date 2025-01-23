import express from 'express';
import User from '../models/User.js';
import Van from '../models/Van.js';

const router = express.Router();

router.patch('/update-booking-status', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { bookingId } = req.body;

    if (!userId || !bookingId) {
      return res.status(400).json({ error: 'Missing user ID or booking ID' });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, 'bookings._id': bookingId },
      { $set: { 'bookings.$.status': 'inactive' } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Booking not found or user not authorized' });
    }

    const { date } = user.bookings.find(booking => booking._id.toString() === bookingId);
    const van = await Van.findOne({'reservations.date': date});

    if(!van){
        return res.status(404).json({ error: 'Van reservation not found for the specified date' });
    }

    const reservation = van.reservations.find(res => res.date.toString() === date.toString());

    if(!reservation){
        return res.status(404).json({ error: 'Reservation not found for this van on the specified date' });
    }

    const seatIndex = reservation.seats.findIndex(seat => seat.bookingId === bookingId);

    if (seatIndex !== -1) {
        reservation.seats[seatIndex].isReserved = false;
        reservation.seats[seatIndex].bookingId = null;
        await van.save();
      } else {
        return res.status(404).json({ error: 'Seat not found for this booking in the reservation' });
      }

    res.status(200).json({ message: 'Booking status and van seat updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
