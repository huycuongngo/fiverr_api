const { successCode, failCode, errorCode } = require('../utils/response');
const _ = require('lodash');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { Op } = require("sequelize");
const { validateDate, validateHour, convertDate } = require('../utils/validate');

const model = initModel(sequelize);

// GET
const getHireJobList = async (req, res) => {
  try {
    let hireJobList = await model.ThueCongViec.findAll()
    successCode(res, hireJobList)
  } catch (error) {
    errorCode(res, error)
  }
}

const getHireJobById = async (req, res) => {
  try {
    let { id } = req.params
    console.log(id)
    let checkHireJob = await model.ThueCongViec.findByPk(id)
    if (checkHireJob) {
      successCode(res, checkHireJob)
    } else {
      failCode(res, "", "ID hirejob không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// POST
const addHireJob = async (req, res) => {
  try {
    let { ma_nguoi_thue, ma_cong_viec, ngay_thue, gio_thue } = req.body
    console.log({ ma_nguoi_thue, ma_cong_viec, ngay_thue, gio_thue })

    let checkDate = validateDate(ngay_thue);
    let checkHour = validateHour(gio_thue);
    let checkUser = await model.NguoiDung.findByPk(ma_nguoi_thue)
    let checkJob = await model.CongViec.findByPk(ma_cong_viec)
    let checkUserAndJob = await model.ThueCongViec.findAll({
      where: {
        ma_nguoi_thue,
        ma_cong_viec
      }
    })
    if (checkDate) {
      if (checkHour) {
        if (checkUser) {
          if (checkJob) {
            if (!checkUserAndJob[0]) {
              let dateConverted = convertDate(ngay_thue)
              let ngay_gio_thue = `${dateConverted}T${gio_thue}.000Z`;
              let newHireJob = {
                ma_nguoi_thue,
                ma_cong_viec,
                ngay_gio_thue,
                hoan_thanh: false
              }
              let result = await model.ThueCongViec.create(newHireJob)
              successCode(res, result)
            } else {
              failCode(res, "", `User ${ma_nguoi_thue} đã thuê công việc ${ma_cong_viec}!`)
            }
          } else {
            failCode(res, "", "ID công việc không tồn tại!")
          }
        } else {
          failCode(res, "", "ID người thuê không tồn tại!")
        }
      } else {
        failCode(res, "", "Giờ định dạng hh:mm:ss!")
      }
    } else {
      failCode(res, "", "Ngày không hợp lệ! Nhập ngày định dạng DD/MM/YYYY")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// PUT
const updateHireJob = async (req, res) => {
  try {
    let { id } = req.params
    let { ma_nguoi_thue, ma_cong_viec, ngay_thue, gio_thue } = req.body

    let checkDate = validateDate(ngay_thue);
    let checkHour = validateHour(gio_thue);
    let checkHireJob = await model.ThueCongViec.findByPk(id)
    let checkUser = await model.NguoiDung.findByPk(ma_nguoi_thue)
    let checkJob = await model.CongViec.findByPk(ma_cong_viec)
    let checkUserAndJobAndID = await model.ThueCongViec.findAll({
      where: {
        ma_nguoi_thue,
        ma_cong_viec,
        id
      }
    })
    let checkUserAndJob = await model.ThueCongViec.findAll({
      where: {
        ma_nguoi_thue,
        ma_cong_viec
      }
    })
    if (checkDate) {
      if (checkHour) {
        if (checkHireJob) {
          if (checkUser) {
            if (checkJob) {
              if ((checkUserAndJobAndID[0] && checkUserAndJob[0]) || (!checkUserAndJobAndID[0] && !checkUserAndJob[0])) {
                let dateConverted = convertDate(ngay_thue)
                let ngay_gio_thue = `${dateConverted}T${gio_thue}.000Z`;
                await model.ThueCongViec.update(
                  {
                    ma_nguoi_thue,
                    ma_cong_viec,
                    ngay_gio_thue
                  },
                  {
                    where: { id }
                  }
                )
                let result = await model.ThueCongViec.findByPk(id)
                successCode(res, result)
              } else {
                failCode(res, "", `User ${ma_nguoi_thue} đã thuê công việc ${ma_cong_viec}!`)
              }
            } else {
              failCode(res, "", "ID công việc không tồn tại!")
            }
          } else {
            failCode(res, "", "ID người thuê không tồn tại!")
          }
        } else {
          failCode(res, "", "ID hirejob không tồn tại!")
        }
      } else {
        failCode(res, "", "Giờ định dạng hh:mm:ss!")
      }
    } else {
      failCode(res, "", "Ngày không hợp lệ! Nhập ngày định dạng DD/MM/YYYY")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const updateCompletedHireJob = async (req, res) => {
  try {
    let { id } = req.params
    let checkHireJob = await model.ThueCongViec.findByPk(id)
    if (checkHireJob) {
      let { hoan_thanh } = checkHireJob.dataValues
      if (!hoan_thanh) {
        await model.ThueCongViec.update(
          {
            hoan_thanh: true
          },
          {
            where: {id}
          }
        )
        let result = await model.ThueCongViec.findByPk(id)
        successCode(res, result)
      } else {
        failCode(res, "", `hirejob ${id} đã hoàn thành!`)
      }
    } else {
      failCode(res, "", "ID hirejob không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// DELETE
const deleteHireJob = async (req, res) => {
  try {
    let { id } = req.params
    let checkHireJob = await model.ThueCongViec.findByPk(id)
    if (checkHireJob) {
      let result = await model.ThueCongViec.destroy({
        where: {id}
      })
      successCode(res, result)
    } else {
      failCode(res, "", "ID hirejob không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

module.exports = {
  getHireJobList,
  getHireJobById,

  addHireJob,

  updateHireJob,
  updateCompletedHireJob,

  deleteHireJob
}
