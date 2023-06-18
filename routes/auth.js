const express = require('express')

const router = express.Router()

const multer = require('../middleware/multer')

const authController = require('../controllers/auth')

const {signupUserValidation, signupDocotrValidation } = require('../middleware/validator')


/*
@DESC To register the doctor 
*/
router.post( '/signupDoctor',
    multer.fields([{name:'license',maxCount:1},{name:'photo',maxCount:1}]),

    signupDocotrValidation(),
    async (req,res,next) =>
    {
        await authController.registerDoctor(req.body,req,"doctor",res,next)
    }
)

/*
@DESC To register the user 
*/
router.post('/signupUser',signupUserValidation(), async (req,res,next) =>{
    await authController.registerUser(req.body,req,"user",res,next)
})

/*
@DESC To register the admin 
*/
router.post('/signupAdmin',signupUserValidation(), async (req,res,next) =>{
    await authController.registerAdmin(req.body,req,"admin",res,next)
})


/*
@DESC To login the Doctor 
*/
router.post('/loginDoctor',async(req,res,next) =>
{
    await authController.login(req.body,"doctor",res,next,false)
})



/*
@DESC To login the user 
*/
router.post('/loginUser',async(req,res,next) =>
{
    await authController.login(req.body,"user",res,next,true)
})

/*
@DESC To login the admin 
*/
router.post('/loginAdmin',async(req,res,next) =>
{
    await authController.login(req.body,"admin",res,next,true)
})

// router.post('/forgetPassword',authController.forgetPassword)

module.exports = router




