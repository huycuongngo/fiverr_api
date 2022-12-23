const express = require('express');
const typeJobRoute = express.Router();
const { checkTokenInAPI } = require('../middleware/auth')
const { upload } = require('../middleware/upload')

const {
  getTypeJobList,
  searchTypeJobPagination,
  getTypeJobById,
  getTypeJobMenu,

  addTypeJob,

  updateTypeJob,
  updateTypeJobUploadImage,

  deleteTypeJob
} = require('../controller/typeJobController')


// GET
typeJobRoute.get("/lay-danh-sach-loai-cong-viec", getTypeJobList)
typeJobRoute.get("/phan-trang-tim-kiem", searchTypeJobPagination)
typeJobRoute.get("/lay-thong-tin-loai-cong-viec/:id", getTypeJobById)
typeJobRoute.get("/lay-menu-loai-cong-viec", getTypeJobMenu)

// POST
typeJobRoute.post("/", checkTokenInAPI, addTypeJob)

// PUT
typeJobRoute.put("/:id", checkTokenInAPI, updateTypeJob)
typeJobRoute.put("/upload-hinh-anh/:id", checkTokenInAPI, upload.single('image'), updateTypeJobUploadImage)

// DELETE
typeJobRoute.delete("/:id", checkTokenInAPI, deleteTypeJob)

module.exports = typeJobRoute;
