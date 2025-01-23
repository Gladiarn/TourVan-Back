import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user'
  },
  bookings: [
    {
      destination: { type: String, required: true },
      date: { type: Date, required: true },
      passengers: { type: Number, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      totalPrice: { type: Number, required: true},
      status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
      }
    }
  ]
});

const User = mongoose.model('User', userSchema);

export default User;
