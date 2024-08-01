const mongoose = require("mongoose");
const crypto = require("crypto");
const { createTokenForUser } = require("../services/authentication");

// Define the schema for the 'user' collection
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.svg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// hum database me password ko hash banake save kar rahe hai. jisse hacker hamare db me actual password nh dekh paaye.
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }
  const salt = "secretKey";
  const hashedPassword = crypto
    .createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

// virtual function:-
// matchPassword function
// what is schema.static syntax
// it is used to create a method in a schema that can be called on documents of that schema.
// it allows us to add custom validation logic to our documents.

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not Found");

    // signup karte waqt user ka salt and ActualHashedPassword.
    const salt = user.salt;
    const hashedPassword = user.password;

    // checking the signin Hashedpassword with user ActualHashedPassword
    const userProvidePassword = crypto
      .createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    ("salt" + salt);
    ("hashedPasswordpassword" + hashedPassword);

    ("userProvidePassword" + userProvidePassword);

    if (userProvidePassword !== hashedPassword)
      throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
