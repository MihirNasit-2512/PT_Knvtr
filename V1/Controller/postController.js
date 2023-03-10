const { STATUS } = require("../Helper/Constant");
const User = require("../Model/userSchema");
const Post = require("../Model/postSchema");
const { errorResponse, successResponse } = require("../Helper/response");

exports.newPost = async (req, res) => {
  if (req.user.status == true) {
    try {
      const bdata = req.body;
      const isUser = await User.findOne({ email: req.user.email });
      if (!isUser) {
        res.status(400).send(errorResponse({}, "User Does Not Exists."));
        return false;
      }
      const isPost = await Post.findOne({
        Title: bdata.Title,
        Created_By: isUser._id,
        Status: STATUS.ACTIVE,
      });
      if (isPost) {
        res.status(400).send(errorResponse({}, "Post Already Exists."));
        return false;
      }
      bdata.Created_By = isUser._id;
      const postData = await Post.create(bdata);
      res
        .status(200)
        .send(successResponse({ Title: postData.Title }, "Post Created."));
    } catch (error) {
      throw error;
    }
  }
};

exports.getPosts = async (req, res) => {
  if (req.user.status == true) {
    try {
      const isUser = await User.findOne({ email: req.user.email });
      if (!isUser) {
        res.status(400).send(errorResponse({}, "User Does Not Exists."));
        return false;
      }
      const postData = await Post.find(
        {
          Created_By: isUser._id,
          Status: { $nin: STATUS.DELETED },
        },
        { Created_By: 0, __v: 0 }
      );
      res.status(200).send(successResponse(postData, ""));
    } catch (error) {
      throw error;
    }
  }
};

exports.updatePost = async (req, res) => {
  if (req.user.status == true) {
    try {
      const bdata = req.body;
      const isUser = await User.findOne({ email: req.user.email });
      if (!isUser) {
        res.status(400).send(errorResponse({}, "User Does Not Exists."));
        return false;
      }
      const isPost = await Post.findOne({
        _id: req.params.pid,
        Created_By: isUser._id,
        Status: { $nin: STATUS.DELETED },
      });

      if (!isPost) {
        res.status(400).send(errorResponse({}, "Post Does Not Exists."));
        return false;
      }
      let updObj = {};
      bdata.Title && (updObj.Title = bdata.Title);
      bdata.Body && (updObj.Body = bdata.Body);
      bdata.Status && (updObj.Status = bdata.Status);
      bdata.Geo_location && (updObj.Geo_location = bdata.Geo_location);
      updObj.updatedAt = new Date();
      const postData = await Post.updateOne(
        { _id: isPost._id },
        { $set: updObj }
      );
      if (postData.modifiedCount > 0) {
        res.status(200).send(successResponse({}, "Post Updated."));
      } else {
        res.status(400).send(errorResponse({}, "Post Not Updated."));
      }
    } catch (error) {
      throw error;
    }
  }
};

exports.deletePost = async (req, res) => {
  if (req.user.status == true) {
    try {
      const isUser = await User.findOne({ email: req.user.email });
      if (!isUser) {
        res.status(400).send(errorResponse({}, "User Does Not Exists."));
        return false;
      }
      const isPost = await Post.findOne({
        _id: req.params.pid,
        Created_By: isUser._id,
        Status: { $nin: STATUS.DELETED },
      });

      if (!isPost) {
        res.status(400).send(errorResponse({}, "Post Does Not Exists."));
        return false;
      }
      const postData = await Post.updateOne(
        { _id: isPost._id },
        { $set: { Status: STATUS.DELETED, updatedAt: new Date() } }
      );
      if (postData.modifiedCount > 0) {
        res.status(200).send(successResponse({}, "Post Deleted."));
      } else {
        res.status(400).send(errorResponse({}, "Post Not Deleted."));
      }
    } catch (error) {
      throw error;
    }
  }
};

exports.getPostsByGeoLocation = async (req, res) => {
  try {
    const bdata = req.body;
    if (!bdata.Geo_location) {
      res.status(400).send(errorResponse({}, "Enter Geo Location."));
      return false;
    }
    const postData = await Post.find(
      {
        Geo_location: bdata.Geo_location,
        Status: STATUS.ACTIVE,
      },
      { _id: 0, Status: 0, updatedAt: 0, __v: 0 }
    );

    res.status(200).send(successResponse(postData, ""));
  } catch (error) {
    throw error;
  }
};

exports.dashboard = async (req, res) => {
  try {
    const postData = await Post.aggregate([
      {
        $facet: {
          activePosts: [
            {
              $match: {
                Status: STATUS.ACTIVE,
              },
            },
            {
              $count: "activePosts",
            },
          ],
          inactivePosts: [
            {
              $match: {
                Status: STATUS.INACTIVE,
              },
            },
            {
              $count: "inactivePosts",
            },
          ],
        },
      },
      { $unwind: "$activePosts" },
      { $unwind: "$inactivePosts" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$$ROOT",
              {
                activePosts: "$activePosts.activePosts",
                inactivePosts: "$inactivePosts.inactivePosts",
              },
            ],
          },
        },
      },
    ]);
    res.status(200).send(successResponse(postData, ""));
  } catch (error) {
    throw error;
  }
};
