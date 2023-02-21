const card = require('../models/card');

module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  card
    .create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.removeCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: ' Карточка с указанным _id не найдена.' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.addLike = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((data) => {
      if (data === null) {
        res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.removeLike = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((data) => {
      if (data === null) {
        res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      }
      res.status(500).send({ message: err.message });
    });
};
