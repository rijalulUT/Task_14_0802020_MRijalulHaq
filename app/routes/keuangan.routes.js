module.exports = app =>{
    const keuangan = require("../controllers/keuangan.controller")
    const auth = require("../middleware/auth")
    let router = require("express").Router()

    //create new post
    router.post("/",keuangan.findAll)
     router.post("/",keuangan.create)
    // router.put("/image-photos/:id/:title",posts.UploadImagePost)
    
    app.use("/api/keuangan",auth.isAuth,router)
}