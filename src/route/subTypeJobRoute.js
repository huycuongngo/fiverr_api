const express = require('express');
const subTypeJobRoute = express.Router();
const { upload } = require('../middleware/upload')
const { checkTokenInAPI } = require('../middleware/auth')

const {
  getSubTypeJob,
  searchSubTypeJobPagination,
  getSubTypeJobById,
  getSubTypeJobByTypeJob,

  addSubTypeJob,

  updateSubTypeJob,
  updateSubTypeJobUploadImage,

  deleteSubTypeJob
} = require('../controller/subTypeJobController')

// GET
subTypeJobRoute.get('/', getSubTypeJob)
subTypeJobRoute.get('/phan-trang-tim-kiem', searchSubTypeJobPagination)
subTypeJobRoute.get('/thong-tin-chi-tiet-loai/:id', getSubTypeJobById)
subTypeJobRoute.get('/chi-tiet-loai-theo-loai-cong-viec/:id', getSubTypeJobByTypeJob)


// POST
subTypeJobRoute.post('/', checkTokenInAPI, addSubTypeJob)

// PUT
subTypeJobRoute.put("/:id", checkTokenInAPI, updateSubTypeJob)
subTypeJobRoute.put("/upload-hinh-anh/:id", checkTokenInAPI, upload.single('image'), updateSubTypeJobUploadImage)

// DELETE
subTypeJobRoute.delete('/:id', checkTokenInAPI, deleteSubTypeJob)

module.exports = subTypeJobRoute;
