async acceptBidRequest(req, res, next) {
    try {
      const adminId = req.user._id;
      const bidRequestId = req.query.bidRequestId;
      const bid = await BidRequest.findById(bidRequestId);
      if (!bid) {
        const error = new Error("Bid request not found!");
        error.status = 404;
        return next(error);
      }

      const pharmacyId = bid.pharmacyId;
      const requestId = bid.requestId;
      const medRequest = await MedicineRequest.findById(requestId);
      const userId = medRequest.patientId;
      const paymentId = medRequest.paymentId;
      const paidByUserAmount = medRequest.paidByUserAmount;
      const amount = medRequest.amount;
      const processingFee = medRequest.processingFee;

      medRequest.status = "completed";
      await medRequest.save();
      const orderId = await getNextAppointmentNo();
      const saveBooking = new Booking({
        orderId,
        requestId,
        bidRequestId,
        paymentId,
        paidByUserAmount,
        pharmacyId,
        userId,
        isPaidFull: true,
        amount,
        processingFee,
      });
      await saveBooking.save();
      bid.status = "completed";
      await bid.save();

      sendchatNotification(
        pharmacyId,
        {
          title: "MediTour Global",
          message: `Your bid request has been accepted!`,
        },
        "pharmacy"
      );
      const notification = new Notification({
        senderId: adminId,
        senderModelType: "Admin",
        receiverId: pharmacyId,
        receiverModelType: "Pharmacy",
        title: "MediTour Global",
        message: `Your bid request has been accepted!`,
      });
      await notification.save();

      sendchatNotification(
        userId,
        {
          title: "MediTour Global",
          message: `Your medicine request has been accepted!`,
        },
        "user"
      );
      const notification1 = new Notification({
        senderId: adminId,
        senderModelType: "Admin",
        receiverId: userId,
        receiverModelType: "Users",
        title: "MediTour Global",
        message: `Your medicine request has been accepted!`,
      });
      await notification1.save();

      res.json({
        auth: true,
        message: "Bid request has been accepted successfully!",
      });
    } catch (error) {
      next(error);
    }
  },