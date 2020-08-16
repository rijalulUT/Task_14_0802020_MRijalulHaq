const db = require("../models/index")
const dataReq = require('lodash')
const { buktis } = require("../models/index")
const Keuangan = db.keuangans
const User = db.users
const Bukti = db.buktis
const Op = db.Sequelize.Op

exports.create = (req, res) =>{
    const token = req.headers.token
    User.findOne({ where: { token: token  },raw : true })
        .then(function (users){
        const id_user = users.id
        // Create Post
        const keuangan = {
            kegiatan: req.body.kegiatan,
            tanggal: req.body.tanggal,
            harga: req.body.harga,
            user_id : id_user
        }
        //loop all files (photos)
      
        Keuangan.create(keuangan)
            .then((data)=>{
                res.send(data)
                data = JSON.parse(JSON.stringify(data, null, 4))
                dataReq.forEach(
                    dataReq.keysIn(req.files.photos),
                    (key) => {
                        let photo = req.files.photos[key]    
                        //move photo to uploads directory
                        photo.mv('./uploads/'+ id_user +'/'+data.id+'/bukti_'+key+'.jpg')
                        let struk = {
                            user_id :id_user,
                            id_kegiatan: data.id,
                            directory : '/uploads/'+ id_user +'/'+data.id+'/bukti_'+key+'.jpg'
                        }
                        
                        Bukti.create(struk)
                    }
                )
            }).catch((err)=>{
                res.status(500).send({
                    message: err.message || "some error occured while creating Post"
                })
            })
         
            
            
   }).catch((err)=> {
        res.status(500).send({
            message : err.message || "some error occured"
        })
    })

}

exports.findAll = (req,res) =>{
    if (!req.body.tanggal) {
        res.status(400).send(
            {
                message: "masukkan tanggal dengan format tanggal/bulan/tahun (dd/mm/yyyy)"
            }
        )
        return
    }
    const token = req.headers.token
    User.findOne({ where: { token: token  },raw : true })
        .then((users)=> {
            const id_user = users.id
            console.log
            Keuangan.findAll({where : {user_id : id_user, tanggal: req.body.tanggal},raw:true})
                    .then((keuangans)=>{
                       // keuangan = JSON.parse(JSON.stringify(keuangans, null, 4))
                       for (const key in keuangans) {
                           if (keuangans.hasOwnProperty(key)) {
                               const keuangan = keuangans[key];
                               Bukti.findAll({where : {user_id : id_user,id_kegiatan: keuangan.id},raw:true})
                                    .then((buktis)=>{
                                        res.send({
                                            nama:users.nama,
                                            kegiatan:keuangan.kegiatan,
                                            tanggal:keuangan.tanggal,
                                            bukti: buktis
                                        })
                                    })
                          }
                       }  
                    })
            
        }).catch((err)=> {
            res.status(500).send({
                message : err.message || "some error occured"
            })
        })
}

// exports.UploadImagePost = async (req,res) =>{
//     const id = req.params.id
//     const title = req.params.title
    
//     try {
//         if (!req.files) {
//            res.send({
//                status: false,
//                message: 'No file uploaded'
//            }) 
//         } else {
//             //Use the name of input field
//             let photo = req.files.photo
//             var renamePhoto = +id
//             +"-"
//             +title
//             +(photo.name).substring((photo.name).indexOf("."))

//             Post.update({
//                 photo: renamePhoto
//             },{
//                 where: {id: id}
//             }).then((result)=>{
//                 if (result == 1) {
//                     photo.mv("./uploads/"+renamePhoto)

//                     //send response
//                     res.send({
//                         status: true,
//                         message: 'Photo post File is Uploaded',
//                         data: {
//                             name: photo.name,
//                             rename: renamePhoto,
//                             mimetype: photo.mimetype,
//                             size: photo.size
//                         }
//                     })
//                 } else {
//                     res.send({
//                         message: `Cannot Update post id = ${id}`
//                     })
//                 }
//             })
//         }
//     } catch (err) {
//         res.status(500).send(err)
//     }
// }