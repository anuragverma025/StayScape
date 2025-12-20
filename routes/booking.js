const express = require("express");
const router = express.Router();
// 👇 This is the ONLY place that should import the controller
const bookingController = require("../controllers/bookings.js"); 
const { isLoggedIn } = require("../middleware.js");

router.get("/", isLoggedIn, bookingController.renderBookings);

// Show requests for the Host
router.get("/host", isLoggedIn, bookingController.renderHostBookings);

// Update Booking Status (Accept/Reject)
router.patch("/:id/status", isLoggedIn, bookingController.updateStatus);

module.exports = router;