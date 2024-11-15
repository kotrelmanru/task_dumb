const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
require("./src/libs/hbs-helper");
const config = require("./config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middleware/upload-file");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/views"));

app.use("/assets", express.static(path.join(__dirname, "./src/assets")));
app.use("/uploads", express.static(path.join(__dirname, "./")));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "my-session",
    secret: "kelapamiringlarilurus",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    },
  })
);
app.use(flash());

app.get("/", home);
app.get("/contact", contact);
app.get("/testimonial", testimonial);
app.get("/login", login);
app.get("/register", register);
app.post("/registerPost", registerPost);
app.post("/loginPost", loginPost);

// collection
app.get("/collection", collection);
app.post("/collection", upload.single("image"), collectionPost);
app.post("/delete-collection/:id", collectionDelete);
app.get("/edit-collection/:id", editcollection);
app.post("/edit-collection/:id", upload.single("image-update"), editcollectionPost);
app.get("/collection-detail/:id", collectionDetail);
app.post("/logout", logout);

function login(req, res) {
  res.render("login");
}

function register(req, res) {
  res.render("register");
}
async function registerPost(req, res) {
  const { name, email, password } = req.body;
  const salt = 10;

  const hashedPassword = await bcrypt.hash(password, salt);

  const query = `INSERT INTO users(name, email, password) VALUES('${name}', '${email}', '${hashedPassword}')`;
  await sequelize.query(query, { type: QueryTypes.INSERT });

  res.redirect("login");
}

async function loginPost(req, res) {
  const { email, password } = req.body;

  // verifikasi email
  const query = `SELECT * FROM users_tb WHERE email='${email}'`;
  const user = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (!user.length) {
    req.flash("error", "Email / password salah!");
    return res.redirect("/login");
  }

  const isVerifiedPassword = await bcrypt.compare(password, user[0].password);

  if (!isVerifiedPassword) {
    req.flash("error", "Email / password salah!");
    return res.redirect("/login");
  }

  req.flash("success", "Berhasil Login!");
  req.session.user = user[0];

  res.redirect("/");
}

function logout(req, res) {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
}

async function home(req, res) {
  const user = req.session.user;

  let query;

  // Jika pengguna sudah login, tampilkan proyek yang dibuat oleh pengguna tersebut
  if (user) {
    query = `SELECT collections_tb.*, users_tb.username AS name, collections_tb.name AS collection_name FROM collections_tb LEFT JOIN users_tb ON collections_tb.user_id = users_tb.id WHERE collections_tb.user_id = ${user.id}`;
  } else {
    // Jika pengguna belum login, tampilkan semua proyek
    query = `SELECT collections_tb.*, users_tb.username AS name, collections_tb.name AS collection_name 
    FROM collections_tb 
    LEFT JOIN users_tb ON collections_tb.user_id = users_tb.id
    `;
  }

  let collections = await sequelize.query(query, { type: QueryTypes.SELECT });



  res.render("index", { collections, user });
}

async function collection(req, res) {
  const query = `SELECT * FROM collections_tb`;
  let collections = await sequelize.query(query, { type: QueryTypes.SELECT });

  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  }
  res.render("collection", { collections, user });
}

function contact(req, res) {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  }

  res.render("contact");
}

function testimonial(req, res) {
  res.render("testimonial");
}

async function collectionDetail(req, res) {
  const { id } = req.params;

  const query = `
    SELECT collections_tb.*, users.name AS author 
    FROM collections_tb
    LEFT JOIN users ON collections_tb.user_id = users.id 
    WHERE collections_tb.id = ${id}
  `;
  const collection = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (collection.length > 0) {
    collection[0].technologies = collection[0].technologies
      .replace(/[{}]/g, "")
      .split(",");
    res.render("collection-detail", { collection: collection[0] });
  } else {
    res.status(404).send("collection not found");
  }
}

async function collectionPost(req, res) {
  const {
    collection_name
  } = req.body;

  const { id } = req.session.user;


  const query = `INSERT INTO collections_tb(name, user_id) VALUES ('${collection_name}',${id})`;
  await sequelize.query(query, { type: QueryTypes.INSERT });

  res.redirect("/");
}

async function collectionDelete(req, res) {
  const { id } = req.params;

  const query = `DELETE FROM collections_tb WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });

  res.redirect("/");
}

async function editcollection(req, res) {
  const user = req.session.user;

  const { id } = req.params;
  const query = `SELECT id, name FROM collections_tb WHERE id=${id}
  `;
  const collection = await sequelize.query(query, { type: QueryTypes.SELECT });

  res.render("edit-collection", { collection: collection[0] });
}

async function editcollectionPost(req, res) {
  const { id } = req.params;

  const {
    collection_name,
  } = req.body;


  const query = `UPDATE collections_tb SET name='${collection_name}' WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.UPDATE });

  res.redirect("/");
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
