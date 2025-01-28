const nanoid = require("nanoid-esm");
const Links = require("../models/links");

const generateHash = async () => {
  while (true) {
    const hash = nanoid(6);

    const existingHash = await Links.findOne({ linkHash: hash });

    if (!existingHash) {
      return hash;
    }
  }
};

module.exports = generateHash;
