const { successCode, failCode, errorCode } = require('../utils/response');
const _ = require('lodash');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { validateDate, validateHour, convertDate } = require('../utils/validate');

const model = initModel(sequelize);

// GET
const getCommentList = async (req, res) => {
  try {
    let commentList = await model.BinhLuan.findAll()
    successCode(res, commentList)
  } catch (error) {
    errorCode(res, error)
  }
}

const getCommentListByJob = async (req, res) => {
  try {
    let { id } = req.params
    let checkJob = await model.CongViec.findByPk(id)
    if (checkJob) {
      let result = await model.CongViec.findAll({
        where: { id },
        include: [{
          model: model.BinhLuan,
          as: "BinhLuans"
        }]
      })
      successCode(res, result)
    } else {
      failCode(res, "", "ID công việc không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// POST
const addComment = async (req, res) => {
  try {
    let { ma_nguoi_binh_luan, ma_cong_viec, ngay_binh_luan, gio_binh_luan, noi_dung, sao_binh_luan} = req.body

    let checkDate = validateDate(ngay_binh_luan)
    let checkHour = validateHour(gio_binh_luan)
    let checkUser = await model.NguoiDung.findByPk(ma_nguoi_binh_luan)
    let checkJob = await model.CongViec.findByPk(ma_cong_viec)
  
    if (checkDate) {
      if (checkHour) {
        if (checkUser) {
          if (checkJob) {
            let dateConverted = convertDate(ngay_binh_luan)
            let ngay_gio_binh_luan = `${dateConverted}T${gio_binh_luan}.000Z`;
            let checkDateHourComment = await model.BinhLuan.findAll({
              where: {
                ma_nguoi_binh_luan,
                ma_cong_viec,
                ngay_gio_binh_luan
              }
            })
            if (!checkDateHourComment[0]) {
              let newComment = {
                ma_nguoi_binh_luan,
                ma_cong_viec,
                id: 0,
                ngay_gio_binh_luan,
                noi_dung,
                sao_binh_luan
              }
              let result = await model.BinhLuan.create(newComment)
              successCode(res, result)
            } else {
              failCode(res, "", "Ngày giờ bình luận đã bị trùng!")
            }            
          } else {
            failCode(res, "", "ID công việc không tồn tại!")
          }
        } else {
          failCode(res, "", "ID người bình luận không tồn tại!")
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
const updateComment = async (req, res) => {
  try {
    let {id} = req.params
    let { ma_nguoi_binh_luan, ma_cong_viec, ngay_binh_luan, gio_binh_luan, noi_dung, sao_binh_luan } = req.body
    
    let checkDate = validateDate(ngay_binh_luan)
    let checkHour = validateHour(gio_binh_luan)
    let checkComment = await model.BinhLuan.findByPk(id)
    let checkUser = await model.NguoiDung.findByPk(ma_nguoi_binh_luan)
    let checkJob = await model.CongViec.findByPk(ma_cong_viec)

    if (checkDate) {
      if (checkHour) {
        if (checkComment) {
          if (checkUser) {
            if (checkJob) {
              let dateConverted = convertDate(ngay_binh_luan)
              let ngay_gio_binh_luan = `${dateConverted}T${gio_binh_luan}.000Z`;
              let checkUserAndJobAndDateComment = await model.BinhLuan.findAll({
                where: {
                  ma_nguoi_binh_luan,
                  ma_cong_viec,
                  id,
                  ngay_gio_binh_luan
                }
              })
              let checkDateComment = await model.BinhLuan.findAll({
                where: {
                  ngay_gio_binh_luan
                }
              })
              if ((checkUserAndJobAndDateComment[0] && checkDateComment[0]) || (!checkUserAndJobAndDateComment[0] && !checkDateComment[0])) {
                await model.BinhLuan.update(
                  {
                    ma_nguoi_binh_luan,
                    ma_cong_viec,
                    ngay_gio_binh_luan,
                    noi_dung,
                    sao_binh_luan
                  }, 
                  {
                    where: {id}
                  }
                )
                let result = await model.BinhLuan.findByPk(id)
                successCode(res, result)
              } else {
                failCode(res, "", "Ngày giờ bình luận đã bị trùng!")
              }
            } else {
              failCode(res, "", "ID công việc không tồn tại!")
            }
          } else {
            failCode(res, "", "ID người bình luận không tồn tại!")
          }
        } else {
          failCode(res, "", "ID bình luận không tồn tại!")
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

// DELETE
const deleteComment = async (req, res) => {
  try {
    let { id } = req.params
    let checkComment = await model.BinhLuan.findByPk(id)
    if (checkComment) {
      let result = await model.BinhLuan.destroy({
        where: {id}
      })
      successCode(res, result)
    } else {
      failCode(res, "", "ID bình luận không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

module.exports = {
  getCommentList,
  getCommentListByJob,
  
  addComment,

  updateComment,

  deleteComment
}
