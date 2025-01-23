import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    pictureUrl: { type: String, required: true }, 
    bookingCount: { type: Number, default: 0 }, 
    isPromo: { type: Boolean, default: false },
    originalPrice: { type: Number }, 
    discountedPrice: { type: Number }, 
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
