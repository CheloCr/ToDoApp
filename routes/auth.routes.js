const router = require("express").Router();

//controllers imported 
const {signupProcess,loginProcess,logoutProcess} = require ("../controllers/auth.controller")


//todo VAMOS A CREAR EL LOGIN, SIGNUP Y LOGOUT

//Signup process
router.post("/signup",signupProcess );

//Login process
router.post("/login",loginProcess );

//Logout process
router.get("/logout",logoutProcess );



module.exports = router;
