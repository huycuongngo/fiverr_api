const { successCode, failCode, errorCode, emailError } = require('../utils/response');
const _ = require('lodash');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { encodeToken } = require('../middleware/auth');
const { validateEmail, validateDate, convertDate } = require('../utils/validate')
const { paginate } = require('../utils/involveObject')
const { Op } = require('sequelize')
const fs = require('fs')

const model = initModel(sequelize);
let signUpAccountList = [];

// GET
const getUser = async (req, res) => {
  try {
    let userList = await model.NguoiDung.findAll()
    successCode(res, userList)
  } catch (error) {
    errorCode(res, error)
  }
}

const getUserPagination = async (req, res) => {
  try {
    let { keyWord, currentPageId, pageSize } = req.body
    let userList = await model.NguoiDung.findAll({
      where: {
        name: {
          [Op.like]: `%${keyWord}%`
        }
      }
    })
    if (userList[0]) {
      let totalCount = userList.length
      let totalPages = Math.ceil(totalCount / pageSize)
      let result = paginate(userList, pageSize, currentPageId)
      let count = result.length
      successCode(res, { currentPageId, count, totalPages, totalCount, result });
    } else {
      failCode(res, "", `Không tồn tại người dùng có họ tên chứa ký tự ${keyWord}`)
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getUserById = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id)
    let checkId = await model.NguoiDung.findByPk(id)
    if (checkId) {
      successCode(res, checkId)
    } else {
      failCode(res, "", "ID người dùng không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getUserByName = async (req, res) => {
  try {
    let { keyWord } = req.params;
    let userList = await model.NguoiDung.findAll({
      where: {
        name: {
          [Op.like]: `%${keyWord}%`
        }
      }
    })
    if (userList[0]) {
      successCode(res, userList)
    } else {
      failCode(res, "", `Không tồn tại người dùng có họ tên chứa ký tự ${keyWord}`)
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// POST
const signUp = async (req, res) => {
  try {
    let { name, email, pass_word, phone, birth_day, gender, skill, certification } = req.body
    console.log({ name, email, pass_word, phone, birth_day, gender, skill, certification })
    let checkEmailInDb = await model.NguoiDung.findAll({
      where: {
        email
      }
    })

    let checkPhoneInDb = await model.NguoiDung.findAll({
      where: {
        phone,
      }
    })

    let checkDate = validateDate(birth_day)

    if (!validateEmail(email)) {
      failCode(res, "", "Email không hợp lệ!")
    } else {
      if (checkEmailInDb[0]) {
        failCode(res, "", "Email đã tồn tại!")
      } else {
        if (checkPhoneInDb[0]) {
          failCode(res, "", "Số điện thoại đã tồn tại!")
        } else {
          if (!checkDate) {
            failCode(res, "", "Ngày không hợp lệ! Nhập ngày định dạng DD/MM/YYYY")
          } else {
            let checkEmail = signUpAccountList.find(item => item.email === email)
            let checkPhone = signUpAccountList.find(item => item.phone === phone)
            if (!checkEmail && !checkPhone) {
              let formSignUp = {
                name,
                email,
                pass_word,
                phone,
                birth_day: convertDate(birth_day),
                gender,
                role: "user",
                skill,
                certification,
                avatar: null,
              }
              signUpAccountList.push(formSignUp)
              successCode(res, signUpAccountList)
            } else if (!checkEmail && checkPhone) {                          //thay đổi email, và giữ nguyên sdt
              failCode(res, signUpAccountList, "Số điện thoại vừa được đăng ký!")
            } else if (checkEmail && !checkPhone) {                          //giữ nguyên email, và thay đổi sdt
              failCode(res, signUpAccountList, "Email vừa được đăng ký!")
            } else {
              failCode(res, signUpAccountList, "Email và số điện thoại vừa được đăng ký!")
            }
          }
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const logIn = async (req, res) => {
  try {
    let { email, pass_word } = req.body
    console.log(email, pass_word)
    let checkUserInDb = await model.NguoiDung.findAll({
      where: {
        email,
        pass_word,
      }
    })
    let checkEmailInDb = await model.NguoiDung.findAll({
      where: {
        email
      }
    })
    let checkEmail = signUpAccountList.find(item => item.email === email)

    if (!validateEmail(email)) {
      failCode(res, "", "Email không hợp lệ")
    } else {
      if (checkUserInDb[0]) {
        let token = encodeToken(checkUserInDb[0].dataValues)
        successCode(res, { ...checkUserInDb[0].dataValues, "accessToken": token })
      } else {
        if (checkEmailInDb[0]) {
          failCode(res, "", "Email đã tồn tại!")
        } else {
          if (!checkEmail) {
            failCode(res, checkEmail, "Email chưa được đăng ký!")
          } else {
            if (checkEmail?.pass_word !== pass_word) {
              failCode(res, "", "Không đúng mật khẩu đăng ký!")
            } else {
              let token = encodeToken(checkEmail)
              successCode(res, { ...checkEmail, "accessToken": token })
            }
          }
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const addUser = async (req, res) => {
  try {
    let { name, email, pass_word, phone, birth_day, gender, skill, certification } = req.body;
    let checkEmail = signUpAccountList.find(item => item.email === email)
    let checkUserSignUpIndex = signUpAccountList.findIndex(item => item.email === email)

    let checkEmailInDb = await model.NguoiDung.findAll({
      where: {
        email
      }
    })
    let checkPhoneInDb = await model.NguoiDung.findAll({
      where: {
        phone,
      }
    })

    let checkDate = validateDate(birth_day)

    if (!validateEmail(email)) {
      failCode(res, "", "Email không hợp lệ")
    } else {
      if (checkEmailInDb[0]) {
        failCode(res, "", "Email đã tồn tại!")
      } else {
        if (checkPhoneInDb[0]) {
          failCode(res, "", "Số điện thoại đã tồn tại!")
        } else {
          if (!checkDate) {
            failCode(res, "", "Ngày không hợp lệ! Nhập ngày định dạng DD/MM/YYYY")
          } else {
            if (!checkEmail) {
              failCode(res, "", "Sai email đăng ký!")
            } else if (checkEmail.name !== name) {
              failCode(res, "", "Sai họ tên đăng ký!")
            } else if (checkEmail.pass_word !== pass_word) {
              failCode(res, "", "Sai mật khẩu đăng ký!")
            } else if (checkEmail.phone !== phone) {
              failCode(res, "", "Sai số điện thoại đăng ký!")
            } else if (checkEmail.birth_day !== convertDate(birth_day)) {
              failCode(res, "", "Sai ngày tháng năm sinh đăng ký!")
            } else if (checkEmail.gender !== gender) {
              failCode(res, "", "Sai giới tính đăng ký!")
            } else if (checkEmail.skill !== skill) {
              failCode(res, "", "Sai skill đăng ký!")
            } else if (checkEmail.certification !== certification) {
              failCode(res, "", "Sai certification đăng ký!")
            } else {
              name, email, pass_word, phone, birth_day, gender, skill, certification
              let newUser = {
                id: 0,
                name,
                email,
                pass_word,
                phone,
                birth_day: convertDate(birth_day),
                gender,
                role: "user",
                skill,
                certification,
                avatar: null
              }
              let result = await model.NguoiDung.create(newUser);
              successCode(res, result)
              signUpAccountList.splice(checkUserSignUpIndex, 1)
            }
          }
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// PUT
const updateUser = async (req, res) => {
  try {
    let { id } = req.params
    let { name, email, pass_word, phone, birth_day, gender, skill, certification } = req.body;
    let checkUser = await model.NguoiDung.findByPk(id)
    let checkDate = validateDate(birth_day)

    // giữ nguyên email và so_dt của chính nó
    let checkEmailAndPhone = await model.NguoiDung.findAll({
      where: {
        id,
        email,
        phone
      }
    })

    // nếu thay đổi email và giữ nguyên so_dt thì kiểm tra email này có trùng trong db và trùng đăng ký
    let checkEmailInDbItself = await model.NguoiDung.findAll({
      where: {
        id,
        email
      }
    })

    let checkEmailInDb = await model.NguoiDung.findAll({
      where: {
        email,
      }
    })

    // nếu giữ nguyên email và thay đổi so_dt thì kiểm tra so_dt này có trùng trong db và trùng đăng ký
    let checkPhoneInDbItSelf = await model.NguoiDung.findAll({
      where: {
        id,
        phone
      }
    })

    let checkPhoneInDb = await model.NguoiDung.findAll({
      where: {
        phone
      }
    })

    let checkEmail = signUpAccountList.find(item => item.email === email)
    let checkPhone = signUpAccountList.find(item => item.phone === phone)

    if (!checkUser) {
      failCode(res, "", "User không tồn tại!")
    } else {
      if (!validateEmail(email)) {
        failCode(res, "", "Email không hợp lệ")
      } else {
        if (!checkDate) {
          failCode(res, "", "Ngày không hợp lệ! Nhập ngày định dạng DD/MM/YYYY")
        } else {
          if (checkEmailAndPhone[0]) {
            await model.NguoiDung.update(
              {
                name,
                pass_word,
                birth_day: convertDate(birth_day),
                gender,
                skill,
                certification,
              },
              {
                where: { id }
              }
            )
            let userUpdate = await model.NguoiDung.findByPk(id)
            successCode(res, userUpdate)
          } else {
            if (!checkEmailInDbItself[0] && checkEmailInDb[0]) {
              failCode(res, "", "Email đã tồn tại!")
            } else if (checkEmail) {
              failCode(res, "", "Email đã được đăng ký!")
            } else if (!checkEmailInDb[0] && !checkEmail && checkPhoneInDbItSelf[0]) {
              await model.NguoiDung.update(
                {
                  name,
                  email,
                  pass_word,
                  birth_day: convertDate(birth_day),
                  gender,
                  skill,
                  certification,
                },
                {
                  where: { id }
                }
              )
              let userUpdate = await model.NguoiDung.findByPk(id)
              successCode(res, userUpdate)
            } else if (!checkPhoneInDbItSelf[0] && checkPhoneInDb[0]) {
              failCode(res, "", "Số điện thoại đã tồn tại!")
            } else if (checkPhone) {
              failCode(res, "", `Số điện thoại đã được đăng ký!`)
            } else {
              await model.NguoiDung.update(
                {
                  name,
                  pass_word,
                  phone,
                  birth_day: convertDate(birth_day),
                  gender,
                  skill,
                  certification,
                },
                {
                  where: { id }
                }
              )
              let userUpdate = await model.NguoiDung.findByPk(id)
              successCode(res, userUpdate)
            }
          }
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const updateUserUploadImage = async (req, res) => {
  try {
    let { id } = req.params
    let checkImage = (req.file?.mimetype === 'image/png' || req.file?.mimetype === 'image/jpg' || req.file?.mimetype === 'image/gif')
    let checkUserId = await model.NguoiDung.findByPk(id)
    if (!checkImage) {
      failCode(res, "", "Hình ảnh định dạng *.jpg, *.png, *.gif !")
    } else {
      if (!checkUserId) {
        failCode(res, "", "Id không tồn tại!");
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      } else {
        let image = req.file
        await fs.readFile(image.path, async (err, data) => {
          let fileImageBase64 = `data:${image.mimetype};base64,` + Buffer.from(data).toString("base64")
          await model.NguoiDung.update(
            {
              avatar: fileImageBase64
            },
            {
              where: {id}
            }
          )
          let result = await model.NguoiDung.findByPk(id);
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
const deleteUser = async (req, res) => {
  try {
    let { id } = req.params
    let checkID = await model.NguoiDung.findByPk(id)
    if (checkID) {
      let result = await model.NguoiDung.destroy({
        where: {id}
      })  
      successCode(res, result)
    } else {
      failCode(res, "", "ID user không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

module.exports = {
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
}
