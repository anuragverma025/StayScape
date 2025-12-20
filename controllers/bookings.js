const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.renderBookings = async (req, res) => {
    // 1. Find all bookings for the current user
    // 2. Populate the 'listing' info so we can see the title/image
    const bookings = await Booking.find({ user: req.user._id }).populate("listing");

    // 3. Render the new page
    res.render("bookings/index.ejs", { bookings });
};

module.exports.renderHostBookings = async (req, res) => {
    // 1. Find all listings owned by the current user
    const listings = await Listing.find({ owner: req.user._id });
    
    // 2. Extract just the IDs of those listings
    const listingIds = listings.map(l => l._id);

    // 3. Find bookings where the listing is one of OUR listings
    // Populate 'user' so we can see WHO wants to stay
    const bookings = await Booking.find({ listing: { $in: listingIds } })
        .populate("user")
        .populate("listing");

    res.render("bookings/host.ejs", { bookings });
};

module.exports.updateStatus = async (req, res) => {
    let { id } = req.params;
    let { status } = req.body; // "Confirmed" or "Cancelled"

    await Booking.findByIdAndUpdate(id, { status: status });

    req.flash("success", `Booking ${status}!`);
    res.redirect("/bookings/host");
};