import { UnauthenticatedError } from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
  // if (requestUser.role === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError(
    'Έλλειψη εξουσιοδότησης για  πρόσβαση σε αυτήν τη διαδρομή'
  );
};

export default checkPermissions;
