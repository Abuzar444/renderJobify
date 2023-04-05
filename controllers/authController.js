import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import attachCookies from '../utils/attachCookies.js';

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({
    user,
    location: user.location,
  });
};

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('Συμπλήρωσε όλα τα πεδία. (1.Auth Controller)'); // Ελέγχουμε τα στοιχεία που δηλώθηκαν. Εάν κάποιο λείπει στέλνουμε λάθος.
  }
  const user = await User.create({ name, email, password }); // Δημιουργούμε νέο χρήστη
  const token = user.createJWT(); // Δημιουργούμε νέο αποδεικτικό
  attachCookies(res, token);
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      email: user.email,
    },
    location: user.location,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Συμπλήρωσε όλα τα πεδία. (2.Auth Controller)'); // Ελέγχουμε τα στοιχεία που δηλώθηκαν. Εάν κάποιο λείπει στέλνουμε λάθος.
  }

  const user = await User.findOne({ email }).select('+password'); // Ψάχνουμε τον χρήστη. Έπειτα προσθέτουμε και τον κωδικό χρήστη για να τον συγκρίνουμε παρακάτω.
  if (!user) {
    throw new UnauthenticatedError('Λάθος στοιχεία. (1.Auth Controller)');
  }

  const isPasswordCorrect = await user.comparePassword(password); // Συγκρίνουμε τους κωδικούς.
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Λάθος στοιχεία. (2.Auth Controller)');
  }

  const token = user.createJWT(); // Δημιουργούμε νέο αποδεικτικό
  user.password = undefined; // Για να μην συμπεριλάβουμε και τον κωδικό στο αντικείμενο που στέλνουμε πίσω.
  attachCookies(res, token);

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const updateUser = async (req, res) => {
  const { name, lastName, email, location } = req.body;

  if (!email || !lastName || !email || !location) {
    throw new BadRequestError('Συμπλήρωσε όλα τα πεδία. (3.Auth Controller)'); // Ελέγχουμε τα στοιχεία που δηλώθηκαν. Εάν κάποιο λείπει στέλνουμε λάθος.
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT(); // Δημιουργούμε νέο αποδεικτικό
  attachCookies(res, token);

  res.status(StatusCodes.OK).json({
    user,
    location: user.location,
  });
};

const logoutUser = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'Επιτυχής Έξοδος Χρήστη!' });
};

export { registerUser, loginUser, updateUser, getCurrentUser, logoutUser };
