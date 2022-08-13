//Model imported V1
const User = require("./../models/User.model");
const mongoose = require("mongoose");
// Password Library
const bcryptjs = require("bcryptjs");

//
const {clearRes, createJWT} = require ("../utils/utils")

//todo Signup controller
exports.signupProcess = (req, res, next) => {
  const { role, email, password, confirmPassword, ...restUser } = req.body;
  // validate empty fields.
  if (!email.length || !password.length || !confirmPassword.length)
    return res
      .status(400)
      .json({ errorMessage: "No debes mandar camps vacíos" });

  // password matches.
  if (password != confirmPassword)
    return res.status(400).json({ errorMessage: "La contraseña es diferente" });

  // email on DB?.
  User.findOne({ email: email })
    .then((found) => {
      if (found)
        return res.status(400).json({ errorMessage: "el email ya existe" });

      return (
        bcryptjs
          .genSalt(10)
          .then((salt) => bcryptjs.hash(password, salt))
          .then((hashedPassword) => {
            //creamos el nuevo Usuario
            return User.create({
              email,
              password: hashedPassword,
              ...restUser,
            });
          })

          // this contains the user and hashedpassword created on DB
          .then((user) => {
            // return the user for login and access token
            const [header, payload, signature] = createJWT(user);

            //save data in cookies.
            //res.cookie("keyComoSeVaGurdar",datoQueSeGuarda,{opciones})
            res.cookie("headload", `${header}.${payload}`, {
              maxAge: 1000 * 60 * 30,
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });

            res.cookie("signature", signature, {
              maxAge: 1000 * 60 * 30,
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });

            // cleaning mognoose response changing BSON into an object deleting unuseful data.
            const newUser = clearRes(user.toObject());
            res.status(201).json({ user: newUser });
          })
      );
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "el correo utilizado ya está en uso",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

//todo Login controller
exports.loginProcess = (req,res,next) => {
    const {email,password} = req.body

    // empty fields validation
    if(!email || !password || !email.length || !password.length) return res
    .status(400)
    .json({ errorMessage: "No debes mandar camps vacíos" });

     //User on DB?
     User.findOne({email})
     .then(user => {
        if(!user) return res
        .status(400)
        .json({ errorMessage: "Credenciales invalidas" });

    // password matches?
        return bcryptjs.compare(password,user.password)  
        .then(match =>{
            if(!match) return res
            .status(400)
            .json({ errorMessage: "Credenciales invalidas" });

            //creating HWT
            const [header,payload,signature] = createJWT(user)

            res.cookie("headload", `${header}.${payload}`, {
                maxAge: 1000 * 60 * 30,
                httpOnly: true,
                sameSite: "strict",
                secure: false,
              });
  
              res.cookie("signature", signature, {
                maxAge: 1000 * 60 * 30,
                httpOnly: true,
                sameSite: "strict",
                secure: false,
              });

              //cleaning the user response
              const newUser =  clearRes( user.toObject() )
              res.status(200).json({user:newUser})


  
        })    
     })
     .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage: "el correo utilizado ya está en uso",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });


}


//todo Logouit controller
exports.logoutProcess = (req,res,next) => {
    res.clearCookie("headload"),
    res.clearCookie("signature"),
    res.status(200).json({successMessge:"Saliste correctamente"})
}
