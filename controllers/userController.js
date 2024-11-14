const Joi = require("joi");
const userDTO = require("../dto/userDto");
const User = require("../models/user/user");

const userController = {
  async userRegister(req, res, next) {
    try {
      const signUpRegisteration = Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().required(),
      });
      const { error } = signUpRegisteration.validate(req.body);
      if (error) {
        return next(error);
      }
      const { userName, email } = req.body;
      let user;
      const userId = req.user._id;
      try {
        const userSignUp = new User({
          userId,
          userName,
          email,
        });

        user = userSignUp.save();
      } catch (error) {
        return next(error);
      }
      const userDto = new userDTO(user);

      return res.status(201).json({ user: userDto, auth: true });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = userController;
