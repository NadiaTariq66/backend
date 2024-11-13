//  for access and refresh token Payload contains the user data
class JWTService {
  static signAccessToken(payload, expiryTime) {
    return jwt.sign(payload,ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
  }
  static signRefreshToken(payload, expiryTime){
    return jwt.sign(payload,REFRESH_TOKEN_SECRET,{expiresIn:expiryTime})
  }
  static verifyAccessToken(payload, expiryTime){
    return jwt.verify(payload,ACCESS_TOKEN_SECRET,{expiresIn:expiryTime})
  }
  static verifyRefreshToken(token){
    return jwt.verify(token,REFRESH_TOKEN_SECRET)
  }
  static async storeRefereshToken(token,userId){
    try{
      const newToken = new RefreshToken({
          token: token,
          userId: userId
      });
      
      // store in db
      await newToken.save();
  }
  catch(error){
      console.log(error);
  }
}
static async storeAccessToken(token, userId){
  try{
      const newToken = new AcessToken({
          token: token,
          userId: userId,
          adminId:adminId,
      });

      // store in db
      await newToken.save();
  }
  catch(error){
      console.log(error);
  }
}
}

export default JWTService;
