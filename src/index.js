const express = require('express');
const rootRoute = require("./route/rootRoute");
const app = express()
const port = 8081

app.use(express.json());
app.use(express.static('.'))
app.use("/api", rootRoute)

app.listen(port, () => {
  console.log(`server running on ${port}`)
})


// yarn sequelize-auto -h localhost -d fiverr -u root -x 1234 -p 3307 --dialect mysql -o "./src/model" -l es6