require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const {DB_DEPLOY } = process.env;
const sequelize = new Sequelize( DB_DEPLOY,
{

  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: true,
  },
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { User, Role, Sale, Provider, Category, Product, Favorite, Reviews } =
  sequelize.models;

Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Sale);
Sale.belongsTo(User);

User.belongsToMany(Product, { through: "Reviews" });
Product.belongsToMany(User, { through: "Reviews" });

Sale.belongsToMany(Product, { through: "DetailSale" });
Product.belongsToMany(Sale, { through: "DetailSale" });

Provider.belongsToMany(Product, { through: "ProvProd" });
Product.belongsToMany(Provider, { through: "ProvProd" });

Category.hasMany(Product);
Product.belongsTo(Category);

Favorite.belongsToMany(User, { through: "FavUser" });
User.belongsToMany(Favorite, { through: "FavUser" });

// Product.hasMany(Reviews);
// Reviews.belongsTo(Product);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
