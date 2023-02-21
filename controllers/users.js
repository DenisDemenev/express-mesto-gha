const user = require("../models/user");

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getUser = (req, res) => {
  user
    .findById(req.params.userId)
    .then((data) => {
      if (data === null) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      res.send({ data });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Пользователь не найден" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateUser = (req, res) => {
  user
    .findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      { new: true, runValidators: true }
    )
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные в методы обновления профиля",
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    )
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
