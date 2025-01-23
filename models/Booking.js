import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    date: { type: Date, required: true },
    passengers: { type: Number, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
