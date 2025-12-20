const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");
const Booking = require("../models/booking");
maptilerClient.config.apiKey = process.env.MAP_TOKEN;
// const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res) => {
    // 1. Get both search query (q) and category from URL
    const { q, category } = req.query; 
    
    // 2. Start with an empty query object
    let dbQuery = {};

    // 3. If a Search Term exists, add regex search to the query
    if (q) {
        dbQuery.$or = [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ];
    }

    // 4. If a Category exists, add it to the query
    if (category) {
        dbQuery.category = category;
    }

    // 5. Fetch data using the built query
    // If dbQuery is empty, it finds ALL listings.
    // If it has 'category', it finds only that category.
    const allListings = await Listing.find(dbQuery);

    // Optional Debug
    if (allListings.length > 0) {
        console.log("Image Data Check:", allListings[0].image); 
    }

    // 6. Render the page (pass 'category' so we can highlight the icon if needed)
    res.render("listings/index.ejs", { allListings, category });
};

// This function stays exactly the same
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => { // Added 'next'
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    
    // if (!listing) { // <-- ADD THIS CHECK
    //     throw new ExpressError(404, "Listing you requested does not exist!");
    // }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let response = await maptilerClient.geocoding.forward(req.body.listing.location);
    if (!req.file) {
        // If your schema requires an image, stop here and show an error
        req.flash("error", "Listing image is required!");
        return res.redirect("/listings/new");
    }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl =  originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;   
    // 1. Update the text data first (Title, Description, etc.)
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // 2. CHECK: Did the user upload a new image?
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        // 3. If yes, update the image field and save again
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

// In controllers/listings.js
module.exports.createBooking = async (req, res) => {
    let { id } = req.params;
    let { booking } = req.body; // Extract the booking object containing dates

    const listing = await Listing.findById(id);
    
    const newBooking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn: booking.checkIn,   // Save Check-in
        checkOut: booking.checkOut  // Save Check-out
    });

    await newBooking.save();
    
    req.flash("success", "Booking Request Sent! The host will contact you shortly.");
    res.redirect(`/listings/${id}`);
};
