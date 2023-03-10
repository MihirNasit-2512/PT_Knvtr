const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const postController = require("../Controller/postController");
const { validate, validatePost } = require("../Middleware/Validation");
const passport = require("passport");

router.post(
  "/register",
  validate,
  passport.authenticate("signup", { session: false }),
  authController.register
);

router.post(
  "/login",
  validate,
  passport.authenticate("login", { session: false }),
  authController.login
);

router.post(
  "/newPost",
  validatePost,
  passport.authenticate("jwt", { session: false }),
  postController.newPost
);

router.get(
  "/getPosts",
  passport.authenticate("jwt", { session: false }),
  postController.getPosts
);

router.post(
  "/updatePost/:pid",
  passport.authenticate("jwt", { session: false }),
  postController.updatePost
);

router.post(
  "/deletePost/:pid",
  passport.authenticate("jwt", { session: false }),
  postController.deletePost
);

router.post("/getPostsByGeoLocation", postController.getPostsByGeoLocation);

router.get("/dashboard", postController.dashboard);

module.exports = router;
