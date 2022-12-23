const express = require("express");
const commentRoute = express.Router();
const { checkTokenInAPI } = require('../middleware/auth')

const {
  getCommentList,
  getCommentListByJob,

  addComment,

  updateComment,

  deleteComment
} = require("../controller/commentController")


// GET
commentRoute.get("/", getCommentList)
commentRoute.get("/lay-binh-luan-theo-cong-viec/:id", getCommentListByJob)

// POST
commentRoute.post("/", checkTokenInAPI, addComment)

// PUT
commentRoute.put("/:id", checkTokenInAPI, updateComment)

// DELETE
commentRoute.delete("/:id", checkTokenInAPI, deleteComment)

module.exports = commentRoute
