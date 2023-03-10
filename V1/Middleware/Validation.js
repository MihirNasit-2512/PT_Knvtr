const { errorResponse } = require("../Helper/response");
const { passwordMatch, emailMatch } = require("../Helper/Utils");

exports.validate = (req, res, next) => {
  const bdata = req.body;
  if (!bdata.email) {
    res.status(400).send(errorResponse({}, "Enter Email."));
    return false;
  }
  if (!emailMatch(bdata.email)) {
    res.status(400).send(errorResponse({}, "Enter Valid Email."));
    return false;
  }
  if (!bdata.password) {
    res.status(400).send(errorResponse({}, "Enter Password."));
    return false;
  }
  if (!passwordMatch(bdata.password)) {
    res
      .status(400)
      .send(
        errorResponse(
          {},
          "Password must contains 1 Uppercase & Lowercase letter, 1 number, 1 special & min. 8 characters."
        )
      );
    return false;
  }
  next();
};

exports.validatePost = (req, res, next) => {
  const bdata = req.body;
  if (!bdata.Title) {
    res.status(400).send(errorResponse({}, "Enter Post Title."));
    return false;
  }
  if (!bdata.Body) {
    res.status(400).send(errorResponse({}, "Enter Post Body."));
    return false;
  }
  if (!bdata.Geo_location) {
    res.status(400).send(errorResponse({}, "Enter Geo Location."));
    return false;
  }
  next();
};
