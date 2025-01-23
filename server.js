import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import availableRoutes from './routes/availableRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import logoutRoutes from './routes/logoutRoute.js';
import bookingRoutes from  './routes/bookingRoutes.js';
import emergencyRoute from './routes/emergencyRoute.js';
import arrivedRoute from './routes/arrivedRoute.js';

import vanRoute from './routes/vanRoute.js';


import session from 'express-session';
import MongoStore from 'connect-mongo';

import authMiddleware from './middleware/middleware.js';

import inactiveBooking from './routes/inactiveRoutes.js';
import activeBooking from './routes/activeRoutes.js';

import cron from 'node-cron';
import cleanupReservations from './utils/cleanupReservations.js';
import updateBookingStatus from './utils/updateBookingStatus.js';

import editTour from './routes/editTour.js';
import deleteTour from './routes/deleteTour.js';
import addTour from './routes/addTour.js';

import deleteVan from './routes/deleteVan.js';
import addVan from './routes/addVan.js';
import editVan from './routes/editVan.js';
// '*/1 * * * *' for every minute cleaning check

// '0 0 * * *' midnight checking
cron.schedule('*/1 * * * *', async ()=>{
    // console.log("Starting daily reservation cleanup...");
    await cleanupReservations();
})

cron.schedule('*/1 * * * *', async () => {
    // console.log("Starting daily booking status update...");
    await updateBookingStatus();
  });


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    session({
        secret: '09f61682cb7cf554bf163fa954239266021fc05344ca5b0a7d32f68ad925e50bcd2a2604bae37e85aeabc37ec4d692e3266753266b4713d9c039d006873fda57',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
        cookie: {
            httpOnly: true, 
            secure: false, 
            maxAge: 24 * 60 * 60 * 1000 ,
            sameSite: 'strict',
            path: '/'
          }

    })
);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tours', promoRoutes);
app.use('/api/tours', availableRoutes);
app.use('/api/users', loginRoutes);
app.use('/api/users', logoutRoutes);

app.use('/api/book', bookingRoutes);
app.use('/api/bookings', inactiveBooking);
app.use('/api/bookings', activeBooking);
app.use('/api/emergency', emergencyRoute);
app.use('/api/arrived', arrivedRoute);

app.use('/api/van', vanRoute);

app.use('/api/tours', editTour);
app.use('/api/tours', deleteTour);
app.use('/api/tours', addTour);

app.use('/api/van', deleteVan);
app.use('/api/van', addVan);
app.use('/api/van', editVan);

app.get('/', (req, res) =>{
    res.send('Running server for tourvan');
});



//connect to MongoDB(Database)
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('connected to MongoDB');
        app.listen(PORT, ()=>{
            console.log(`Server running on port ${PORT}`)
        });
    })
    .catch((error)=>{
        console.error('Error connecting to MongoDB', error)
    });
