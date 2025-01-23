import express from 'express';
import Tour from '../models/Tour.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/add', async (req, res) =>{
    const {
        name,
        description,
        price,
        pictureUrl,
        isPromo,
        originalPrice,
        discountedPrice,
        latitude,
        longitude,
      } = req.body;

      const userId = req.session.user?.id;
      const user = await User.findById({_id: userId});

      if (!userId || user.userType !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized: Admin access required.' });
      }

      try {

        const newTour = new Tour({
            name,
            description,
            price,
            pictureUrl,
            isPromo,
            originalPrice,
            discountedPrice,
            latitude,
            longitude,
          });

          await newTour.save();
          res.status(201).json({ message: 'Tour added successfully!' });


      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding tour', error: error.message });
      }


})

export default router;