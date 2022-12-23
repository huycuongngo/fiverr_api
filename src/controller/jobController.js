const { successCode, failCode, errorCode } = require('../utils/response');
const _ = require('lodash');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { paginate } = require('../utils/involveObject');
const { Op } = require("sequelize");
const fs = require('fs')

const model = initModel(sequelize);

// GET
const getJobList = async (req, res) => {
  try {
    let jobList = await model.CongViec.findAll();
    successCode(res, jobList)
  } catch (error) {
    errorCode(res, error)
  }
}

const searchJobPagination = async (req, res) => {
  try {
    let { keyWord, currentPageId, pageSize } = req.body;
    let jobList = await model.CongViec.findAll({
      where: {
        ten_cong_viec: {
          [Op.like]: `%${keyWord}%`
        }
      }
    })
    if (jobList[0]) {
      let totalCount = jobList.length
      let totalPages = Math.ceil(totalCount / pageSize)
      let result = paginate(jobList, pageSize, currentPageId)
      let count = result.length
      successCode(res, { currentPageId, count, totalPages, totalCount, result });
    } else {
      failCode(res, "", `Không tồn tại công việc có tên chứa ký tự ${keyWord}`)
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getJobById = async (req, res) => {
  try {
    let { id } = req.params;
    let checkJob = await model.CongViec.findByPk(id)
    if (checkJob) {
      successCode(res, checkJob)
    } else {
      failCode(res, "", "ID công việc không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getJobBySubTypeJob = async (req, res) => {
  try {
    let { id } = req.params
    let checkSubTypeJob = await model.ChiTietLoaiCongViec.findByPk(id)
    if (checkSubTypeJob) {
      let result = await model.ChiTietLoaiCongViec.findAll({
        where: { id },
        include: [{
          model: model.CongViec,
          as: "CongViecs"
        }]
      })
      successCode(res, result)
    } else {
      failCode(res, "", "ID subtypejob không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getJobListByName = async (req, res) => {
  try {
    let { keyWord } = req.params;
    let jobList = await model.CongViec.findAll({
      where: {
        ten_cong_viec: {
          [Op.like]: `%${keyWord}%`
        }
      }
    })
    console.log("jobList", jobList)
    if (jobList[0]) {
      successCode(res, jobList)
    } else {
      failCode(res, "", `Không có công việc có tên chứa ${keyWord}`)
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// POST
const addJob = async (req, res) => {
  try {
    let { nguoi_tao, ma_chi_tiet_loai, ten_cong_viec, danh_gia, gia_tien, mo_ta, mo_ta_ngan, sao_cong_viec } = req.body
    let checkUser = await model.NguoiDung.findByPk(nguoi_tao)
    let checkSubTypeJob = await model.ChiTietLoaiCongViec.findByPk(ma_chi_tiet_loai)
    let checkJobName = await model.CongViec.findAll({
      where: { ten_cong_viec }
    })

    if (checkUser) {
      if (checkSubTypeJob) {
        if (!checkJobName[0]) {
          let newJob = {
            nguoi_tao,
            ma_chi_tiet_loai,
            id: 0,
            ten_cong_viec,
            danh_gia,
            gia_tien,
            hinh_anh: null,
            mo_ta,
            mo_ta_ngan,
            sao_cong_viec
          }
          let result = await model.CongViec.create(newJob)
          successCode(res, result)
        } else {
          failCode(res, "", "Tên công việc đã tồn tại!")
        }
      } else {
        failCode(res, "", "ID subtypejob không tồn tại!")
      }
    } else {
      failCode(res, "", "ID người tạo không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// PUT
const updateJob = async (req, res) => {
  try {
    let { id } = req.params
    let { nguoi_tao, ma_chi_tiet_loai, ten_cong_viec, danh_gia, gia_tien, mo_ta, mo_ta_ngan, sao_cong_viec } = req.body

    let checkJob = await model.CongViec.findByPk(id)
    let checkUser = await model.NguoiDung.findByPk(nguoi_tao)
    let checkSubTypeJob = await model.ChiTietLoaiCongViec.findByPk(ma_chi_tiet_loai)
    let checkJobName = await model.CongViec.findAll({
      where: { ten_cong_viec }
    })
    let checkJobIdAndName = await model.CongViec.findAll({
      where: {
        id,
        ten_cong_viec
      }
    })
    if (checkJob) {
      if (checkUser) {
        if (checkSubTypeJob) {
          if ((checkJobIdAndName[0] && checkJobName[0]) || (!checkJobIdAndName[0] && !checkJobName[0])) {
            let updateJob = {
              nguoi_tao,
              ma_chi_tiet_loai,
              id,
              ten_cong_viec,
              danh_gia,
              gia_tien,
              hinh_anh: null,
              mo_ta,
              mo_ta_ngan,
              sao_cong_viec
            }
            await model.CongViec.update(
              updateJob,
              {
                where: { id }
              }
            )
            let result = await model.CongViec.findByPk(id)
            successCode(res, result)
          } else {
            failCode(res, "", "Tên công việc đã tồn tại!")
          }
        } else {
          failCode(res, "", "ID subtypejob không tồn tại!")
        }
      } else {
        failCode(res, "", "ID người tạo không tồn tại!")
      }
    } else {
      failCode(res, "", "ID công việc không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const updateJobUploadImage = async (req, res) => {
  try {
    let { id } = req.params;
    let checkImage = (req.file?.mimetype === 'image/png' || req.file?.mimetype === 'image/jpg' || req.file?.mimetype === 'image/gif')
    let checkJob = await model.CongViec.findByPk(id)
    if (!checkImage) {
      failCode(res, "", "Hình ảnh định dạng *.jpg, *.png, *.gif !")
    } else {
      if (!checkJob) {
        failCode(res, "", "Id công việc không tồn tại!");
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      } else {
        let image = req.file
        await fs.readFile(image.path, async (err, data) => {
          let fileImageBase64 = `data:${image.mimetype};base64,` + Buffer.from(data).toString("base64")
          await model.CongViec.update(
            {
              hinh_anh: fileImageBase64
            },
            {
              where: { id }
            }
          )
          let result = await model.CongViec.findByPk(id);
          successCode(res, result)
        })
        fs.unlink(image.path, (err) => {
          if (err) console.error(err)
        })
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// DELETE
const deleteJob = async (req, res) => {
  try {
    let { id } = req.params
    let checkJob = await model.CongViec.findByPk(id)
    if (checkJob) {
      let result = await model.CongViec.destroy({
        where: {id}
      }) 
      successCode(res, result)
    } else {
      failCode(res, "", "ID công việc không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

module.exports = {
  getJobList,
  searchJobPagination,
  getJobById,
  getJobBySubTypeJob,
  getJobListByName,

  addJob,

  updateJob,
  updateJobUploadImage,

  deleteJob
}
