const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");
const { uploadFile } = require("../services/storage.service");

async function createFood(req, res) {
  try {
    console.log("CreateFood body:", req.body);
    console.log("CreateFood file:", req.file);
    console.log("CreateFood foodPartner:", req.foodPartner);

    // partner auth
    if (!req.foodPartner || !req.foodPartner._id) {
      return res.status(401).json({ message: "Food partner not authenticated" });
    }

    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Food name is required" });
    }

    // single file from multer
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Food video is required" });
    }

    // upload to ImageKit
    const uploadResult = await uploadFile(req.file.buffer, uuid());
    console.log("Uploaded URL:", uploadResult.url);

    const foodItem = await foodModel.create({
      name: name.trim(),
      description: description || "",
      video: uploadResult.url,           // single URL
      foodPartner: req.foodPartner._id,
    });

    return res.status(201).json({
      message: "food created successfully",
      food: foodItem,
    });
  } catch (err) {
    console.error("Error creating food:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/food
async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
}

// post food-like
async function likeFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  if (!user || !user._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const isAlreadyLiked = await likeModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadyLiked) {
    await likeModel.deleteOne({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: -1 },
    });

    return res.status(200).json({
      message: "Food unliked successfully",
    });
  }

  const like = await likeModel.create({
    user: user._id,
    food: foodId,
  });

  await foodModel.findByIdAndUpdate(foodId, {
    $inc: { likeCount: 1 },
  });

  res.status(201).json({
    message: "Food liked successfully",
    like,
  });
}

// POST /api/food/save
async function saveFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  if (!user || !user._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const isAlreadySaved = await saveModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadySaved) {
    await saveModel.deleteOne({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { savesCount: -1 },
    });

    return res.status(200).json({
      message: "Food unsaved successfully",
    });
  }

  const save = await saveModel.create({
    user: user._id,
    food: foodId,
  });

  await foodModel.findByIdAndUpdate(foodId, {
    $inc: { savesCount: 1 },
  });

  res.status(201).json({
    message: "Food saved successfully",
    save,
  });
}

// GET /api/food/save
async function getSaveFood(req, res) {
  const user = req.user;

  if (!user || !user._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const savedFoods = await saveModel
    .find({ user: user._id })
    .populate("food");

  if (!savedFoods || savedFoods.length === 0) {
    return res.status(404).json({ message: "No saved foods found" });
  }

  res.status(200).json({
    message: "Saved foods retrieved successfully",
    savedFoods,
  });
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
};
