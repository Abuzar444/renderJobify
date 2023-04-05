const notFoundMiddleware = (req, res) => {
  res.status(404).send('Η διαδρομή (route) δεν υπάρχει! (Not Found Middleware)');
};

export default notFoundMiddleware;
