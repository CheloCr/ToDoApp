//token Library
const jwt = require("jsonwebtoken");

//mognoose respnse cleaning
exports.clearRes = (data) => {
    const {password,createdAt,updatedAt,__v,...restData} = data
    return restData
}

//creating Token for access
exports.createJWT = (user) => {
    //jwt.sign({valorEncriptar},palabra secreta,{opciones})
    return jwt.sign({
        userId:user._id,
        email:user.email,
        role:user.role,
    },process.env.SECRET,{expiresIn:"24h"}).split(".")

}