import express from 'express';
import Tour from '../models/Tour.js';  
import User from '../models/User.js';

const router = express.Router();

router.delete('/available/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.session.user?.id;
    const user = await User.findById({_id: userId});
    if (!userId || user.userType !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized: Admin access required.' });
    }

    const deletedRecord = await Tour.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
