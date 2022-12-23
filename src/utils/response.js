const successCode = (res, data) => {
  res.status(200).json({
    statusCode: '200',
    message: 'Xử lý thành công!',
    content: data
  })
}

const failCode = (res, data, message) => {
  res.status(400).json({
    statusCode: '400',
    message,
    content: data
  })
}

const errorCode = (res, error) => {
  console.log(error)
  res.status(500).json({
    statusCode: '500',
    message: "Server Error"
  })
}

const emailError = (res, err) => {
  let message = err.message
  res.status(400).json({
    statusCode: '400',
    message
  })
}

module.exports = {
  successCode,
  failCode,
  errorCode,
  emailError
}
