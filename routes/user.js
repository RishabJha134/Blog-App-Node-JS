const { Router } = require("express");
const router = Router();
const User = require("../models/user");

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  (req.body);
  const { fullname, email, password } = req.body;
  await User.create({
    fullname,
    email,
    password,
  });
  return res.redirect("/user/signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // ("User", token);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    return res.render("signin", {
      // ye chiz hum direct backend me bhej rahe hai error:- we can access this by help of locals.error in anywhere page.
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = router;
