import express from 'express'
import authenticateUser from '../middleware/auth.js';
import { registerUser, loginUser, updateUser, getCurrentUser, logoutUser} from '../controllers/authController.js'
import rateLimiter from 'express-rate-limit';
import testUser from '../middleware/test-user.js';


const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 λεπτά
  max: 10,
  msg: 'Πάρα πολλά αιτήματα από αυτήν την διεύθυνση IP, δοκιμάστε ξανά μετά από 15 λεπτά.'
})

const authRouter = express.Router()

authRouter.route('/registerUser').post(apiLimiter, registerUser);
authRouter.route('/loginUser').post(apiLimiter, loginUser);
authRouter.route('/getCurrentUser').get(authenticateUser, getCurrentUser);
authRouter.route('/updateUser').patch(authenticateUser, testUser, updateUser);
authRouter.route('/logoutUser').get(logoutUser);



export default authRouter;