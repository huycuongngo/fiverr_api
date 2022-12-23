const express = require('express');
const rootRoute = express.Router();

const userRoute = require("./userRoute")
const typeJobRoute = require("./typeJobRoute")
const subTypeJobRoute = require('./subTypeJobRoute')
const jobRoute = require('./jobRoute')
const hireJobRoute = require('./hireJobRoute');
const commentRoute = require('./commentRoute');

rootRoute.use("/users", userRoute)
rootRoute.use("/loai-cong-viec", typeJobRoute)
rootRoute.use("/chi-tiet-loai-cong-viec", subTypeJobRoute)
rootRoute.use("/cong-viec", jobRoute)
rootRoute.use("/thue-cong-viec", hireJobRoute)
rootRoute.use("/binh-luan", commentRoute)  

module.exports = rootRoute;
