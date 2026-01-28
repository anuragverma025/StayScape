if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express(); 
app.get('/images/favicon.ico', (req, res) => res.status(204).end());
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingsRouter = require("./routes/booking.js");

const dbURL = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB")
    })
    .catch((err) => {
        console.log(err);
    });

async function main () {
    await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,             
    saveUninitialized: true,    
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/", (req, res) => {
    res.redirect("/listings"); 
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use((req, res, next) => {
    console.log("REQ:", req.method, req.originalUrl, "Referer:", req.get("referer"));
    next();
});

app.use("/listings", listingRouter);
app.use("/bookings", bookingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
    res.sendStatus(204);
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use((req, res, next) => {
    console.log("404 Request for:", req.originalUrl);
    next(new ExpressError("page not found", 404));
});

app.use((err, req, res) => {
    let { statusCode = 500, message = "something went wrong"} = err;
    if (typeof statusCode !== "number" ){
        const parsed = Number(statusCode);
        statusCode = Number.isInteger(parsed) ? parsed : 500;
    }
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});