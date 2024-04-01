import express from 'express'
import authCrtl from '../controller/authCtrl.js'
import authenticate from '../middleware.js'
const router = express.Router()
// register api 
router.post('/register', authCrtl.register)
router.post('/login', authCrtl.login)
router.get('/login',authenticate ,authCrtl.logout)
router.post('/forgotpassword',authCrtl.sendpasswordlink)
router.post('/:id/:token',authCrtl.setpassword)



export default router;