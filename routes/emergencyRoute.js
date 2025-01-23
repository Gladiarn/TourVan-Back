import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/help', async (req, res) => {
  const {latitude, longitude} = req.body;

  const userId = req.session.user?.id;
  
  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tourvantacloban@gmail.com', 
        pass: 'efou fivu xvzg hwnq', 
      },
    });

    // Create the email options
    const mailOptions = {
      from: 'tourvantacloban@gmail.com',
      to: 'bulilaniannecarl@gmail.com', 
      subject: 'Emergency Alert!',
      text: `User ID: ${userId} has triggered an emergency alert.\n\nCurrent Location: Latitude: ${latitude} , Longitude: ${longitude} .`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Emergency alert sent successfully.' });
  } catch (error) {
    console.error('Error sending emergency email:', error);
    res.status(500).json({ message: 'Failed to send emergency alert.', error });
  }
});

export default router;
