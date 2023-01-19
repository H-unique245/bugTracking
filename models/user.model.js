const { model } = require("mongoose");

const {Schema}= require("mongoose");

const UserSchema= new Schema ({
    email: {
        type: String,
        unique: true,
    },
    password: String,
    version:false
})

const UserModel = model("users", UserSchema);

module.exports= UserModel;