import express from 'express';
import Van from '../models/Van.js';
import User from '../models/User.js';

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
      const { name, totalSeats, plateNumber, driverName } = req.body;
        
      if (!name || !totalSeats || !plateNumber || !driverName) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const userId = req.session.user?.id;
      const user = await User.findById({_id: userId});

      if (!userId || user.userType !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized: Admin access required.' });
      }

  
      const newVan = new Van({
        name,
        totalSeats,
        plateNumber,
        driverName,
        reservations: [],
      });
  
      const savedVan = await newVan.save();
      res.status(201).json(savedVan);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while adding the van." });
    }
  });
  

  export default router;
