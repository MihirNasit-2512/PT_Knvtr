const { errorResponse, successResponse } = require("../Helper/response");

exports.register = async (req, res) => {
  if (req.user.status == false) {
    res.status(400).send(errorResponse({}, req.user.message));
    return false;
  }
  res
    .status(200)
    .send(successResponse({ email: req.user.email }, req.user.message));
};

exports.login = async (req, res) => {
  if (req.user.status == false) {
    res.status(400).send(errorResponse({}, req.user.message));
    return false;
  }
  res
    .status(200)
    .send(
      successResponse(
        { email: req.user.email, token: req.user.token },
        req.user.message
      )
    );
};
