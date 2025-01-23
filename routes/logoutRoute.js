import express from 'express';

const router = express.Router();

router.post('/logout', (req, res)=>{

    req.session.destroy((error)=>{
        
        if(error){
            return res.status(500).json({message: 'Failed to log-out '})
        }

        res.clearCookie('connect.sid', { path: '/' });
        res.clearCookie('name', { path: '/' });
        res.clearCookie('email', { path: '/' });
        res.clearCookie('userType', { path: '/' });

        res.status(200).json({message: 'Successfully Logged out'});
    })
});

export default router;