const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const fileUpload = require("express-fileupload")


//Models 
const db = require("./app/models/index")

const app = express()

//create log
app.use(morgan("combined"))

//parse request  application / json x-www-form-urlencode
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


//sync database
db.sequelize.sync()

//enable file upload
app.use(fileUpload({
    createParentPath:true,
    limits: {
        fileSize : 1000000
    },
    abortOnLimit: true
}))

// add another middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//post routes
require("./app/routes/keuangan.routes")(app)
require("./app/routes/user.routes")(app)

//set port, listen for request
const PORT = process.env.PORT || 8080

app.listen(PORT,() =>{
    console.log(`server is running on http://localhost:${PORT}`)
})