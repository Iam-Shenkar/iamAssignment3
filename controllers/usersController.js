const { User } = require('../services/authService');
const { oneTimePass } = require('../services/registerService');

const getUsers = async (req, res) => res.sendStatus(200);

async function handleGetUsers(req, res) {
  const showAllUser = await User.find({});
  return res.send(JSON.stringify(showAllUser));
}

async function handleGetUser(req, res) {
  const user = await User.retrieve({ email: req.params.email });
  return res.send(JSON.stringify(user));
}

async function handleUpdateUser(req, res) {
  try {
    console.log(req.body);
    await User.update({ email: req.body.email }, { data: req.body });
    return res.status(200).json({ message: 'user update' });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}

async function handleDeleteUser(req, res) {
  try {
    await User.find({ email: req.body.email });
    await oneTimePass.delete({ email: req.body.email });
    return res.status(200).json({ message: 'The user has been deleted' });
  } catch (e) {
    return res.status(401).json({ message: e.message });
  }
}

module.exports = {
  getUsers, handleGetUsers, handleGetUser, handleDeleteUser, handleUpdateUser,
};
