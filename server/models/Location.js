import mongoose from "mongoose";

/**
 * Location schema
 *
 * Represents a physical location that can be referenced by a QR code.
 *
 * Examples:
 * - Floor: 7
 * - Block: "B"
 * - Room code: "7B-16" (room 16 on floor 7, block B)
 */

const roomSchema = new mongoose.Schema(
  {
    /**
     * Room number within the block/floor.
     * Expected range: "01"–"18" (kept as string to preserve leading zero).
     */
    number: {
      type: String,
      required: true,
      match: [/^(0[1-9]|1[0-8])$/, "Room number must be between 01 and 18"],
    },

    /**
     * Full room code, e.g. "7B-16".
     * This is derived from floor + block + number but stored explicitly
     * for quick lookup and QR mapping.
     */
    code: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    /**
     * Floor number, e.g. 1, 2, 3, 7, etc.
     */
    floor: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Block identifier, e.g. "A", "B", "C".
     */
    block: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * All rooms on this floor/block.
     * Each room must have a code like "7B-16".
     */
    rooms: [roomSchema],

    /**
     * Neighboring / closest blocks to this location, e.g. ["A", "C"].
     */
    closestBlocks: [
      {
        type: String,
        trim: true,
      },
    ],

    /**
     * Optional list of nearby rooms (by code) for quick navigation,
     * e.g. ["7B-15", "7B-17", "7A-16"].
     */
    closestRooms: [
      {
        type: String,
        trim: true,
      },
    ],

    /**
     * A string used to associate this location with a QR code.
     * This might be the QR's payload or an identifier you encode in the QR.
     */
    qrCodeRef: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);




