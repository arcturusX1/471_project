// seedLocations.js
const mongoose = require("mongoose");
const Location = require("./models/Location");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://db_connect:9wnOGOZ4RVGtCttH@cluster0.puwqhsb.mongodb.net/?appName=Cluster0";

const blocks = ["A", "B", "C", "D", "E", "F"];
const floors = Array.from({ length: 12 }, (_, i) => i + 1);

// helper: "01".."18"
const roomNumbers = Array.from({ length: 18 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

function buildRooms(floor, block) {
  return roomNumbers.map((num) => ({
    number: num,
    code: `${floor}${block}-${num}`, // e.g. "7B-16"
  }));
}

function closestBlocksFor(block) {
  const idx = blocks.indexOf(block);
  const res = [];
  if (idx > 0) res.push(blocks[idx - 1]);
  if (idx < blocks.length - 1) res.push(blocks[idx + 1]);
  return res;
}

function closestRoomsFor(floor, block) {
  // just take 3 middle rooms as "nearby" examples (can adjust as needed)
  return ["08", "09", "10"].map((num) => `${floor}${block}-${num}`);
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const locations = [];

    for (const floor of floors) {
      for (const block of blocks) {
        locations.push({
          floor,
          block,
          rooms: buildRooms(floor, block),
          closestBlocks: closestBlocksFor(block),
          closestRooms: closestRoomsFor(floor, block),
          qrCodeRef: `${floor}${block}`, // QR value, e.g. "7B"
        });
      }
    }

    await Location.deleteMany({});
    console.log("Cleared existing locations");

    await Location.insertMany(locations);
    console.log(`Inserted ${locations.length} locations`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding locations:", err);
    process.exit(1);
  }
}

seed();