const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const path = require("path");
const maptilerClient = require("@maptiler/client");

// 1. ✅ FIX: Robustly find the .env file
// This ensures it finds the file even if you run the command from the root folder
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
  
  // Only run initDB if connection succeeds
  await initDB();
}

const initDB = async () => {
  // Check for API Key
  if (!process.env.MAP_TOKEN) {
      console.log("❌ ERROR: MAP_TOKEN is missing! Check your .env file.");
      return;
  }
  
  maptilerClient.config.apiKey = process.env.MAP_TOKEN;

  // Clear old data
  await Listing.deleteMany({});
  console.log("Old data cleared. Starting Geocoding...");

  for (let obj of initData.data) {
    // 1. Geocoding Logic
    try {
        const response = await maptilerClient.geocoding.forward(obj.location);
        obj.geometry = response.features[0].geometry;
        
        // ⚠️ YOUR OWNER ID
        obj.owner = '6943a08bb9a78871e721c7d3'; 

        console.log(`✅ Geocoded: ${obj.location}`);
    } catch (e) {
        console.log(`⚠️ Fallback for: ${obj.location}`);
        obj.geometry = { type: "Point", coordinates: [77.209, 28.6139] };
    }
    
    // ❌ REMOVED: Random Category Assignment
    // The script will now use the category already written in data.js
  }

  await Listing.insertMany(initData.data);
  console.log("🎉 Success! Data initialized with CORRECT categories.");
};