const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: { 
      type:String,
      unique:true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      required:true
    },
    password:{
      type:String,
      unique:true,
      trim: true, // quita los espacios
      required:true
    },
    //! ES MUY IMPORTANTE
    role: {
      type:String,
      enum:["Admin","User"],
      default:"User"
    },
    fisrtName:{
      type:String,
      minlength: 1
    },
    lastName:{
      type:String,
      minlength: 1
    },
    imageUrl: {
      type:String,
      default:"https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
