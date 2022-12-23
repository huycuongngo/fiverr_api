const {successCode, failCode, errorCode, emailError} = require('./response')
//  DD/MM/YYYY
const validateDate = (dateString) => {
  let regex = /^(((0[1-9]|[12][0-9]|3[01])([/])(0[13578]|10|12)([/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([/])(0[469]|11)([/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([/])(02)([/])(\d{4}))|((29)(\/)(02)([/])([02468][048]00))|((29)([/])(02)([/])([13579][26]00))|((29)([/])(02)([/])([0-9][0-9][0][48]))|((29)([/])(02)([/])([0-9][0-9][2468][048]))|((29)([/])(02)([/])([0-9][0-9][13579][26])))$/g
  return regex.test(dateString)
}

//  YYYY-MM-DD
const convertDate = (dateString) => {
  return dateString.split("/").reverse().join("-")
}

//  hh:mm:ss
const validateHour = (hour) => {
  let regex = /^(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)$/g
  return regex.test(hour);
}

const validateEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  } 
  return false
}

module.exports = {
  validateDate,
  convertDate,
  validateHour,
  validateEmail,
}
