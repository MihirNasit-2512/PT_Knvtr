const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

exports.passwordMatch = (password) => {
  return passRegex.test(password);
};

exports.emailMatch = (email) => {
  return emailRegex.test(email);
};
