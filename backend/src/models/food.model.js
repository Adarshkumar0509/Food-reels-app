const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // New: multiple video URLs
    videos: [
      {
        type: String,
        required: true,
      },
    ],
    // Optional: keep old single video if you still need it
    // video: {
    //   type: String,
    // },

    description: {
      type: String,
    },
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodpartner",
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    savesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;



// const mongoose = require('mongoose');

// const foodSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     video: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//     },
//     foodPartner: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "foodpartner"
//     },
//     likeCount: {
//         type: Number,
//         default: 0
//     },
//     savesCount: {
//         type: Number,
//         default: 0
//     }
// })


// const foodModel = mongoose.model("food", foodSchema);


// module.exports = foodModel;
