import express from 'express';
import Van from '../models/Van.js';
import User from '../models/User.js';

const router = express.Router();

router.put('/edit/:vanId', async (req, res) => {
  const { vanId } = req.params;
  const { name, totalSeats, plateNumber, driverName } = req.body;

  const userId = req.session.user?.id;
  const user = await User.findById({_id: userId});

  if (!userId || user.userType !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized: Admin access required.' });
    }

  try {

    const updatedVan = await Van.findByIdAndUpdate(
      vanId,
      { name, totalSeats, plateNumber, driverName },
      { new: true }
    );

    if (!updatedVan) {
      return res.status(404).json({ message: 'Van not found' });
    }

    res.status(200).json(updatedVan);
  } catch (error) {
    console.error('Error updating van:', error);
    res.status(500).json({ message: 'Failed to update van' });
  }
});


export default router;