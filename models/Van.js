import mongoose from 'mongoose';


const vanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  plateNumber: { type: String, required: true, unique: true },
  driverName: { type: String, required: true },
  reservations: [
    {
      date: { type: Date, required: true },
      seats: [
        {
          seatId: { type: String, required: true },
          isReserved: { type: Boolean, default: false },
          reservedBy: { type: String }, 
          bookingId: { type: String, required: false }
        }
      ],
      users: [
        {type: String, required: true, }, //users who booked
      ],
    }
  ]
}, { timestamps: true });


const Van = mongoose.model('Van', vanSchema);

export default Van;
