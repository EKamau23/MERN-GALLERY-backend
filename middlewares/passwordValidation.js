exports.validatePassword = (req, res, next) => {
    const { password } = req.body;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include both letters and numbers.',
      });
    }
    next();
  };
  