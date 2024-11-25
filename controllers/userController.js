const Joi = require("joi");
const User = require("../models/user/user");
const bcrypt = require("bcryptjs");
const UserDTO = require("../dto/userDto");
const JWTService = require("../services/JWTService.js");
const RefreshToken = require("../models/refreshToken.js");
const AccessToken = require("../models/accessToken");
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/\\|-])[a-zA-Z\d!@#$%^&*()_+{}\[\]:;<>,.?/\\|-]{8,25}$/;

async function getNextMrNo() {
  // Find the latest user in the database and get their mrNo
  const latestUser = await User.findOne()
    .sort({ createdAt: -1 })
    .select("mrNo");

  // If there are no users yet, start with "000001"
  const nextMrNo = latestUser
    ? String(Number(latestUser.mrNo) + 1).padStart(6, "0")
    : "000001";

  return nextMrNo;
}
const authController = {
  async register(req, res, next) {
    const userRegisterSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      ntnNo: Joi.string().allow(""),
      phone: Joi.string().required(),
      password: Joi.string().pattern(passwordPattern).required().messages({
        "string.pattern.base":
          "Password must be 8 characters long and include one uppercase letter, one lowercase letter, one digit and one special character.",
      }),
      address: Joi.object().required(),
      fcmToken: Joi.string().required(),
    });

    const { error } = userRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { name, email, ntnNo, phone, password, fcmToken } = req.body;
    const emailRegex = new RegExp(email, "i");
    emailExists = await User.findOne({ email: { $regex: emailRegex } });

    if (emailExists) {
      const error = {
        status: 409,
        message: "Email Already Registered",
      };

      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    try {
      // Get the next unique mrNo
      const mrNo = await getNextMrNo();

      // Create a new user with the generated mrNo
      const userToRegister = new User({
        name,
        email,
        ntnNo,
        phone,
        password,
        fcmToken,
      });

      user = await userToRegister.save();
    } catch (error) {
      return next(error);
    }
    // Response send
    return res.status(201).json({ user, auth: true });
  },
  async acceptHotelRequest(req, res, next) {
    try {
      const requestId = req.query.requestId;
      const adminId = req.user._id;
      const request = await HotelBookingRequests.findById(requestId).populate(
        "hotelId serviceId userId"
      );

      // Check if request is found
      if (!request) {
        const error = new Error("Booking request not found!");
        error.status = 404;
        return next(error);
      }
      const hotelId = request.hotelId;
      const serviceId = request.serviceId;
      const rooms = request.rooms;
      const userId = request.patientId;
      const apartments = request.apartments;
      const paymentId = request.paymentId;
      const paidByUserAmount = request.paidByUserAmount;
      const totalAmount = request.totalAmount;
      const processingFee = request.processingFee;
      const name = request.name;
      const email = request.email;
      const purpose = request.purpose;
      const address = request.address;
      const age = request.age;
      const arrivalDate = request.arrivalDate;
      const noOfGuest = request.noOfGuest;
      const remainingAmount = request.remainingAmount;
      // Change the status to "accepted"
      request.status = "accepted";
      // Save the updated request
      await request.save();
      const bookingId = await getNextBookingNo();

      const saveBooking = new Booking({
        paymentId,
        bookingId,
        paidByUserAmount,
        serviceModelType,
        hotelId,
        rooms,
        serviceId,
        apartments,
        userId,
        noOfGuest,
        name,
        email,
        age,
        address,
        purpose,
        totalAmount,
        arrivalDate,
        processingFee,
        isPaidFull,
        gatewayName,
        remainingAmount,
      });
      await saveBooking.save();
      request.status = "accepted";
      await request.save();
      // Update the stripe transaction ID
      const stripeTransaction = await stripePaymentTransaction.findOne({
        id: requestId,
      });
      stripeTransaction.id = booking._id;
      stripeTransaction.idModelType = "Hotel Booking";
      await stripeTransaction.save();

      // Send notifications to user and hotel
      sendchatNotification(
        userId._id,
        {
          title: "MediTour Global",
          message: `Your booking request has been accepted.`,
        },
        "user"
      );

      sendchatNotification(
        request.hotelId._id,
        {
          title: "MediTour Global",
          message: `You have received a new booking`,
        },
        "travel"
      );

      // Create a notification for the user
      const notification = new Notification({
        senderId: adminId,
        senderModelType: "Admin",
        receiverId: userId._id,
        receiverModelType: "Users",
        title: "MediTour Global",
        message: "Your booking request has been accepted",
      });
      await notification.save();

      // Create a notification for the hotel
      const hotelNotification = new Notification({
        senderId: adminId,
        senderModelType: "Admin",
        receiverId: request.hotelId._id,
        receiverModelType: "Hotel",
        title: "MediTour Global",
        message: `You have received a new booking`,
      });
      await hotelNotification.save();

      // Send the response with the booking details
      res.status(200).json({
        auth: true,
        booking,
        message: "Booking Accepted successfully",
      });
    } catch (error) {
      // Log any errors to understand where the issue is
      console.error("Error occurred:", error);
      next(error);
    }
  },
};
module.exports = authController;
