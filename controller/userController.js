const Users = require("../model/userModels");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usercheck = await Users.findOne({ username });
    if (usercheck) {
      return res.status(400).json({ msg: "Username already exists", status: false });
    }

    const emailcheck = await Users.findOne({ email });
    if (emailcheck) {
      return res.status(400).json({ msg: "Email already exists", status: false });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      username,
      email,
      password: hashedpassword
    });

    return res.status(201).json({ status: true, user: newUser });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Wrong Username", status: false });
    }

    const passwordcheck = await bcrypt.compare(password, user.password);
    if (!passwordcheck) {
      return res.status(400).json({ msg: "Wrong Password", status: false });
    }

    return res.status(200).json({ user, status: true });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId  = req.params.id;
    const AvatarImage  = req.body.image;
    const userdata  = await Users.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      AvatarImage
    });

    return res.status(200).json({ 
      isSet: userdata.isAvatarImageSet,
      image: userdata.AvatarImage
     });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users  = await Users.find({_id:{$ne: req.params.id}}).select(
      [
        "email",
        "username",
        "AvatarImage",
        "_id",
        "verified"
      ]
    );

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};
