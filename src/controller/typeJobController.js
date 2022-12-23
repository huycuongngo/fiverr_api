const { successCode, failCode, errorCode } = require('../utils/response')
const { Op } = require("sequelize");
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { paginate } = require('../utils/involveObject')
const fs = require('fs')

const model = initModel(sequelize);

// GET
const getTypeJobList = async (req, res) => {
  try {
    let result = await model.LoaiCongViec.findAll();
    successCode(res, result)
  } catch (error) {
    errorCode(res, error)
  }
}

const searchTypeJobPagination = async (req, res) => {
  try {
    let { keyWord, currentPageId, pageSize } = req.body;
    let typeJobList = await model.LoaiCongViec.findAll({
      where: {
        ten_loai_cong_viec: {
          [Op.like]: `%${keyWord}%`
        }
      }
    })
    if (typeJobList[0]) {
      let totalCount = typeJobList.length
      let totalPages = Math.ceil(totalCount / pageSize)
      let result = paginate(typeJobList, pageSize, currentPageId)
      let count = result.length
      successCode(res, { currentPageId, count, totalPages, totalCount, result });
    } else {
      failCode(res, "", `Không tồn tại loại công việc có tên chứa ký tự ${keyWord}`)
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getTypeJobById = async (req, res) => {
  try {
    let { id } = req.params
    let checkTypeJob = await model.LoaiCongViec.findByPk(id)
    if (checkTypeJob) {
      successCode(res, checkTypeJob)
    } else {
      failCode(res, "", "ID type job không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getTypeJobMenu = async (req, res) => {
  try {
    let typeJobMenu = await model.LoaiCongViec.findAll({
      include: [{
        model: model.ChiTietLoaiCongViec,
        as: "ChiTietLoaiCongViecs"
      }]
    })
    successCode(res, typeJobMenu)
  } catch (error) {
    errorCode(res, error)
  }
}

// POST
const addTypeJob = async (req, res) => {
  try {
    let { ten_loai_cong_viec } = req.body
    let checkTypeJobName = await model.LoaiCongViec.findAll({
      where: {
        ten_loai_cong_viec
      }
    })
    if (checkTypeJobName[0]) {
      failCode(res, "", "Tên loại công việc đã tồn tại!")
    } else {
      let result = await model.LoaiCongViec.create({
        id: 0,
        ten_loai_cong_viec,
        hinh_anh: null
      })
      successCode(res, result)
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// PUT
const updateTypeJob = async (req, res) => {
  try {
    let { id } = req.params
    let { ten_loai_cong_viec } = req.body
    let checkTypeJob = await model.LoaiCongViec.findByPk(id)
    if (checkTypeJob) {
      // xem như tên không thay đổi gì
      if (checkTypeJob.dataValues.ten_loai_cong_viec === ten_loai_cong_viec) {
        successCode(res, checkTypeJob)
      } else {
        let checkTypeJobName = await model.LoaiCongViec.findAll({
          where: {
            ten_loai_cong_viec
          }
        })
        if (checkTypeJobName[0]) {
          failCode(res, "", "Tên loại công việc đã tồn tại!")
        } else {
          await model.LoaiCongViec.update(
            {
              ten_loai_cong_viec
            },
            {
              where: { id }
            }
          )
          let result = await model.LoaiCongViec.findByPk(id)
          successCode(res, result)
        }
      }
    } else {
      failCode(res, "", "ID loại công việc không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const updateTypeJobUploadImage = async (req, res) => {
  try {
    let { id } = req.params;
    let checkImage = (req.file?.mimetype === 'image/png' || req.file?.mimetype === 'image/jpg' || req.file?.mimetype === 'image/gif')
    let checkTypeJob = await model.LoaiCongViec.findByPk(id)
    if (!checkImage) {
      failCode(res, "", "Hình ảnh định dạng *.jpg, *.png, *.gif !")
    } else {
      if (!checkTypeJob) {
        failCode(res, "", "Id loại công việc không tồn tại!");
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      } else {
        let image = req.file
        await fs.readFile(image.path, async (err, data) => {
          let fileImageBase64 = `data:${image.mimetype};base64,` + Buffer.from(data).toString("base64")
          await model.LoaiCongViec.update(
            {
              hinh_anh: fileImageBase64
            },
            {
              where: { id }
            }
          )
          let result = await model.LoaiCongViec.findByPk(id);
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
const deleteTypeJob = async (req, res) => {
  try {
    let { id } = req.params
    let checkTypeJob = await model.LoaiCongViec.findByPk(id)
    if (!checkTypeJob) {
      failCode(res, "", "ID loại công việc không tồn tại!")
    } else {
      let result = await model.LoaiCongViec.destroy({
        where: {id}
      })
      successCode(res, result)
    }
  } catch (error) {
    errorCode(res, error)
  }
}

module.exports = {
  getTypeJobList,
  searchTypeJobPagination,
  getTypeJobById,
  getTypeJobMenu,

  addTypeJob,

  updateTypeJob,
  updateTypeJobUploadImage,

  deleteTypeJob
}
