import express from 'express';
import Tour from '../models/Tour.js';
import User from '../models/User.js';
import Van from '../models/Van.js';

const router = express.Router();

router.post('/booking', async (req, res) => {
    const { destination, date, passengers, latitude, longitude, status, van, seats } = req.body;

    try {
        const userId = req.session.user?.id;

        
        if (!userId) {
            return res.status(401).json({ message: "User is not logged in" });
        }

        

        const tour = await Tour.findOne({ name: destination });
        if (!tour) {
            return res.status(404).json({ message: "Tour not found" });
        }

        const selectedVan = await Van.findOne({ _id: van});
        if(!selectedVan){
            return res.status(404).json({ message: "Van not found" });
        }

        const existingReservation = selectedVan.reservations.find(
            (reservation) => reservation.date.toISOString().split('T')[0] === date
        );

        // Calculate the total price for the booking
        const totalPrice = passengers * tour.price;

        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        // Add booking to the user's data
        const newBooking = {
        destination,
        date,
        passengers,
        latitude,
        longitude,
        totalPrice,
        status,
        };

        user.bookings.push(newBooking);
        await user.save();

        const userEmail = user.email;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //get the recent pushed booking;s id
        const bookingId = user.bookings[user.bookings.length - 1]._id.toString();

        if (existingReservation) {
            // Update existing reservation
            existingReservation.users.push(userEmail);
        
            seats.forEach((seat) => {
                // making sure seatId is a string then log
                const stringSeatId = seat.seatId.toString();
                console.log(`Processing seatId: ${stringSeatId}`);
            
                const existingSeat = existingReservation.seats.find((s) => s.seatId === stringSeatId);
                
                // If seat exists, update reservation
                if (existingSeat) {
                    existingSeat.isReserved = true;
                    existingSeat.reservedBy = userEmail;
                    existingSeat.bookingId = bookingId;
                } else {
                    // If seat doesn't exist, add it as a new reservation
                    existingReservation.seats.push({
                        seatId: stringSeatId,
                        isReserved: true,
                        reservedBy: userEmail,
                        bookingId: bookingId,
                    });
                }
            });
        
            // Mark the reservations array as modified
            selectedVan.markModified('reservations');
        } else {
            // Create a new reservation for this date
            selectedVan.reservations.push({
                date: new Date(date), // Ensure the date is properly formatted
                users: [userEmail],
                seats: seats.map((seat) => ({
                    seatId: seat.seatId.toString(),
                    isReserved: true,
                    reservedBy: userEmail,
                    bookingId: bookingId,
                })),
            });
        
            // Mark the reservations array as modified
            selectedVan.markModified('reservations');
        }
        
        await selectedVan.save();




        // Update the tour booking count
        tour.bookingCount += 1;
        await tour.save();

        res.status(200).json({ message: "Booking added successfully", bookings: user.bookings });
    } catch (error) {
        res.status(500).json({ message: "Server error while booking: ", error });
    }
});

export default router;