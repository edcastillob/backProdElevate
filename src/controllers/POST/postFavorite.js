const { Favorite, User } = require("../../db");

const postFavorite = async (req, res) => {
  console.log(req.body);
  const {
    id,
    name,
    brand,
    condition,
    description,
    salePrice,
    images,
    stock,
    isActive,
    user,
  } = req.body;
  if (!name || !description || !salePrice || !images || !stock || !isActive) {
    return res.status(401).send("Faltan datos");
  }

  try {
    const searchUser = await User.findOne({ where: { email: user } });

    const favorite = await Favorite.create({
      id,
      name,
      brand,
      condition,
      description,
      salePrice,
      images,
      stock,
      isActive,
    });
    await favorite.addUser(searchUser.id);

    return res.status(201);
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = { postFavorite };
