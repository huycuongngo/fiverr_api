const express = require('express');
const userRoute = express.Router();
const { checkTokenInAPI } = require("../middleware/auth")

const {
  getUser,
  getUserPagination,
  getUserById,
  getUserByName,

  signUp,
  logIn,
  addUser,

  updateUser,
  updateUserUploadImage,

  deleteUser,
} = require('../controller/userController');
const { upload } = require('../middleware/upload');


// GET
userRoute.get("/", getUser);
userRoute.get("/phan-trang-tim-kiem", getUserPagination)
userRoute.get("/:id", getUserById)
userRoute.get("/search/:keyWord", getUserByName)

// POST
userRoute.post("/signup", signUp)
userRoute.post("/login", logIn)
userRoute.post("/", checkTokenInAPI, addUser)

// PUT
userRoute.put("/:id", checkTokenInAPI, updateUser)
userRoute.put("/uploadImage/:id", upload.single("image"), checkTokenInAPI, updateUserUploadImage)

// DELETE
userRoute.delete("/:id", checkTokenInAPI, deleteUser)

module.exports = userRoute;
