import User from '../models/User.js';

const updateBookingStatus = async ()=>{
    try {
        const currentDate = new Date()
        currentDate.setHours(0,0,0,0);
        
        const users = await User.find({});

        for (const user of users) {
            let updated = false;

            user.bookings.forEach((booking)=>{
                if(booking.status === 'active' && new Date(booking.date) < currentDate) {
                    booking.status = 'inactive';
                    updated = true;
                }
            });

            if (updated) {
                await user.save();
                
            }
        }

        
    } catch (error) {
        console.error('Error updating booking statuses: ', error);
    }
};

export default updateBookingStatus;