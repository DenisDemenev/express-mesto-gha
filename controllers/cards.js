const card = require('../models/card');

const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  card
    .find({})
    .populate(['owner'])
    .then((cards) => res.status(CREATED).send({ data: cards }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  card
    .create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.removeCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (!data) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: ' Карточка с указанным _id не найдена.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
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
      if (!data) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Передан несуществующий _id карточки.',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
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
      if (!data) {
        return res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Передан несуществующий _id карточки.',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};
