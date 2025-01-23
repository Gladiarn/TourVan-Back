import express from 'express';
import Tour from '../models/Tour.js';
import User from '../models/User.js';

const router = express.Router();

router.put('/update/:id', async (req,res) =>{

    const {id} = req.params;
    const updatedTour = req.body;

    const userId = req.session.user?.id;
    const user = await User.findById({_id: userId});

    if (!userId || user.userType !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized: Admin access required.' });
      }

try {
    
    if(updatedTour.isPromo !== undefined){
        updatedTour.isPromo = updatedTour.isPromo === 'true';
    }

    const tour = await Tour.findByIdAndUpdate(id, updatedTour, { new: true});

    if(!tour) {
        return res.status(404).json({error: 'Tour not found'});
    }

    res.status(200).json({ message: 'Tour updated successfully', tour });

} catch (error) {

    console.error('Error updating tour:', err);
    res.status(500).json({ error: 'Error updating tour', details: err.message });
}

})

export default router;