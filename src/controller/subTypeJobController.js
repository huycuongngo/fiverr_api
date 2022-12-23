const { successCode, failCode, errorCode } = require('../utils/response');
const _ = require('lodash');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { paginate } = require('../utils/involveObject');
const { Op } = require("sequelize");
const fs = require('fs')

const model = initModel(sequelize);

// GET
const getSubTypeJob = async (req, res) => {
  try {
    let subTypeJobList = await model.ChiTietLoaiCongViec.findAll()
    successCode(res, subTypeJobList)
  } catch (error) {
    errorCode(res, error)
  }
}

const searchSubTypeJobPagination = async (req, res) => {
  try {
    let { keyWord, currentPageId, pageSize } = req.body;
    let subTypeJobList = await model.ChiTietLoaiCongViec.findAll({
      where: {
        ten_chi_tiet: {
          [Op.like]: `%${keyWord}%`
        }
      }
    })
    if (subTypeJobList[0]) {
      let totalCount = subTypeJobList.length
      let totalPages = Math.ceil(totalCount / pageSize)
      let result = paginate(subTypeJobList, pageSize, currentPageId)
      let count = result.length
      successCode(res, { currentPageId, count, totalPages, totalCount, result });
    } else {
      failCode(res, "", `Không tồn tại chi tiết loại công việc có tên chứa ký tự ${keyWord}`)
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getSubTypeJobById = async (req, res) => {
  try {
    let { id } = req.params
    let checkSubTypeJob = await model.ChiTietLoaiCongViec.findByPk(id)
    if (checkSubTypeJob) {
      successCode(res, checkSubTypeJob)
    } else {
      failCode(res, "", "ID subtypejob không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getSubTypeJobByTypeJob = async (req, res) => {
  try {
    let { id } = req.params;
    let checkTypeJob = await model.LoaiCongViec.findByPk(id)
    if (checkTypeJob) {
      let result = await model.LoaiCongViec.findAll(
        {
          where: { id },
          include: [{
            model: model.ChiTietLoaiCongViec,
            as: "ChiTietLoaiCongViecs"
          }]
        }
      )
      successCode(res, result)
    } else {
      failCode(res, "", "ID typejob không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// POST
const addSubTypeJob = async (req, res) => {
  try {
    let { ma_loai_cong_viec, ten_chi_tiet } = req.body
    console.log({ ma_loai_cong_viec, ten_chi_tiet })
    let typeJobId = await model.LoaiCongViec.findByPk(ma_loai_cong_viec);
    let checkSubTypeJobName = await model.ChiTietLoaiCongViec.findAll({
      where: {
        ten_chi_tiet
      }
    })
    if (typeJobId) {
      if (checkSubTypeJobName[0]) {
        failCode(res, "", "Tên subtypejob đã tồn tại!")
      } else {
        let newSubTypeJob = {
          ma_loai_cong_viec,
          id: 0,
          ten_chi_tiet,
          hinh_anh: null
        }
        let result = await model.ChiTietLoaiCongViec.create(newSubTypeJob)
        successCode(res, result)
      }
    } else {
      failCode(res, "", "ID typejob không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// PUT
const updateSubTypeJob = async (req, res) => {
  try {
    let { id } = req.params
    let { ma_loai_cong_viec, ten_chi_tiet } = req.body

    let checkTypeJobId = await model.LoaiCongViec.findByPk(ma_loai_cong_viec)
    let checkSubTypeJobId = await model.ChiTietLoaiCongViec.findByPk(id)
    let checkSubTypeJobItself = await model.ChiTietLoaiCongViec.findAll({
      where: {
        ma_loai_cong_viec,
        id,
        ten_chi_tiet
      }
    })
    let checkSubTypeJobIdAndName = await model.ChiTietLoaiCongViec.findAll({
      where: {
        id,
        ten_chi_tiet
      }
    })
    let checkSubTypeJobName = await model.ChiTietLoaiCongViec.findAll({
      where: {
        ten_chi_tiet
      }
    })

    // nếu giữ nguyên ma_loai_cong_viec va ten_chi_tiet
    if (checkSubTypeJobItself[0]) {
      successCode(res, checkSubTypeJobItself[0])
    } else {
      if (!checkSubTypeJobId) {
        failCode(res, "", "ID subtypejob không tồn tại!")
      } else {
        if (!checkTypeJobId) {
          failCode(res, "", "ID typejob không tồn tại!")
        } else {
          if ((checkSubTypeJobIdAndName[0] && checkSubTypeJobName[0]) || (!checkSubTypeJobIdAndName[0] && !checkSubTypeJobName[0])) {
            await model.ChiTietLoaiCongViec.update(
              {
                ma_loai_cong_viec,
                id,
                ten_chi_tiet
              },
              {
                where: { id }
              }
            )
            let result = await model.ChiTietLoaiCongViec.findByPk(id)
            successCode(res, result)
          } else {
            failCode(res, "", "Tên chi tiết loại công việc đã tồn tại")
          }
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const updateSubTypeJobUploadImage = async (req, res) => {
  try {
    let { id } = req.params;
    let checkImage = (req.file?.mimetype === 'image/png' || req.file?.mimetype === 'image/jpg' || req.file?.mimetype === 'image/gif')
    let checkSubTypeJob = await model.ChiTietLoaiCongViec.findByPk(id)
    if (!checkImage) {
      failCode(res, "", "Hình ảnh định dạng *.jpg, *.png, *.gif !")
    } else {
      if (!checkSubTypeJob) {
        failCode(res, "", "Id subtypejob không tồn tại!");
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      } else {
        let image = req.file
        await fs.readFile(image.path, async (err, data) => {
          let fileImageBase64 = `data:${image.mimetype};base64,` + Buffer.from(data).toString("base64")
          await model.ChiTietLoaiCongViec.update(
            {
              hinh_anh: fileImageBase64
            },
            {
              where: { id }
            }
          )
          let result = await model.ChiTietLoaiCongViec.findByPk(id);
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
const deleteSubTypeJob = async (req, res) => {
  try {
    let { id } = req.params
    let checkSubTypeJob = await model.ChiTietLoaiCongViec.findByPk(id)
    if (checkSubTypeJob) {
      let result = await model.ChiTietLoaiCongViec.destroy({
        where: { id }
      })
      successCode(res, result)
    } else {
      failCode(res, "", "ID subtypejob không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

module.exports = {
  getSubTypeJob,
  searchSubTypeJobPagination,
  getSubTypeJobById,
  getSubTypeJobByTypeJob,

  addSubTypeJob,

  updateSubTypeJob,
  updateSubTypeJobUploadImage,

  deleteSubTypeJob
}
