const express = require("express");
const jobRoute = express.Router();
const { checkTokenInAPI } = require('../middleware/auth')
const { upload } = require('../middleware/upload')

const {
  getJobList,
  searchJobPagination,
  getJobById,
  getJobBySubTypeJob,
  getJobListByName,

  addJob,

  updateJob,
  updateJobUploadImage,

  deleteJob
} = require("../controller/jobController")

// GET
jobRoute.get("/", getJobList)
jobRoute.get("/phan-trang-tim-kiem", searchJobPagination)
jobRoute.get("/lay-cong-viec-theo-id/:id", getJobById)
jobRoute.get("/lay-cong-viec-theo-chi-tiet-loai/:id", getJobBySubTypeJob)
jobRoute.get("/lay-danh-sach-cong-viec-theo-ten/:keyWord", getJobListByName)

// POST
jobRoute.post("/", checkTokenInAPI, addJob)

// PUT
jobRoute.put("/:id", checkTokenInAPI, updateJob)
jobRoute.put("/cap-nhat-upload-hinh/:id", checkTokenInAPI, upload.single('image'), updateJobUploadImage)

// DELETE
jobRoute.delete("/:id", checkTokenInAPI, deleteJob)

module.exports = jobRoute
