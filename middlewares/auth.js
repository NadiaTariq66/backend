const JWTService = require("../services/JWTService");
const AccessToken = require("../models/accessToken");
const User = require("../models/user/user");
const UserDTO = require("../dto/userDto");
// const verifyAccessToken = require("../models/accessToken");

const auth = async()=>{
    try{
const authHeader= req.headers["authorizaion"];

// auth header http request k header m sy authorization header ko retrieve krta hai or phr check krna hta hai k auth header m token h ya nahi or agar nahi hai toh us m token ko split kr dy

const accessToken= authHeader&&authHeader.split("")[1];
const ifTokenExists = await AccessToken.find({token:accessToken});

if(ifTokenExists==""){
    const error={
        status: 401,
        message: "Unauthorize",
    }
return next (error)
}
if (!accessToken){
    const error={
        status: 401,
        message: "Unauthorize"
    }
    return next (error)
}
let _id;
 _id = JWTService.verifyAccessToken(accessToken)._id;
 let user;
    if (req.originalUrl.includes("/user")) {
      try {
        user = await User.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const UserDto = new UserDTO(user);

      req.user = UserDto;

      next();
      return;
    }

    }catch(error){
       return next(error);
    }

}
module.exports= auth;