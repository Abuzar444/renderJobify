import { BadRequestError } from '../errors/index.js';

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Δεν επιτρέπονται οι αλλαγές στην «Λειτουργία Επίδειξης».');
  }
  next();
};

export default testUser;