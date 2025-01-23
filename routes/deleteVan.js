import express from 'express';
import Van from '../models/Van.js';
import User from '../models/User.js';

const router = express.Router();

router.delete('/delete/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const userId = req.session.user?.id;
        const user = await User.findById({_id: userId});
        if (!userId || user.userType !== 'admin') {
          return res.status(401).json({ message: 'Unauthorized: Admin access required.' });
        }
        
        const van = await Van.findByIdAndDelete(id);
        if (!van) return res.status(404).json({ message: 'Van not found' });
        res.status(200).json({ message: 'Van deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting van', error });
    }
});

export default router;
