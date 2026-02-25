const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Optional: sanity check on startup
if (!process.env.IMAGEKIT_PUBLIC_KEY ||
    !process.env.IMAGEKIT_PRIVATE_KEY ||
    !process.env.IMAGEKIT_URL_ENDPOINT) {
  console.error("ImageKit env vars are missing. Check your .env file.");
}

async function uploadFile(buffer, fileName) {
  try {
    if (!buffer) {
      throw new Error("No buffer provided to uploadFile");
    }
    if (!fileName) {
      throw new Error("No fileName provided to uploadFile");
    }

    const result = await imagekit.upload({
      file: buffer,      // Buffer from multer: req.file.buffer
      fileName,          // e.g. uuid()
    });

    return result;       // result.url is the uploaded file URL
  } catch (err) {
    console.error("ImageKit upload error:", err);
    throw err;
  }
}

module.exports = {
  uploadFile,
};
