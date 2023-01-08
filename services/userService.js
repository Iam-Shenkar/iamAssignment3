const { httpError } = require('../class/httpError');
const { User } = require('../repositories/repositories.init');

const updateName = async (user, data) => {
  if (user.email !== data.email) throw new httpError(400, 'you cant update this user');
  if (user.status !== 'active') throw new httpError(400, 'user is closed');
  await User.update({ email: user.email }, { name: data.name });
};

const adminUpdateUser = async (data) => {
  const user = await User.retrieve({ email: data.email });
  if (user.role === 'manager' && data.status === 'closed') throw new httpError(400, 'you cant update this user');

  const updateData = {
    name: data.name,
    // role: data.role,
    status: data.status,
  };
  if (data.status === 'suspended') {
    const suspensionData = {
      suspensionTime: data.suspensionTime,
      suspensionDate: new Date(),
    };
    Object.assign(updateData, suspensionData);
  }
  await User.update({ email: user.email }, { ...updateData });
};

const deleteAuthorization = (user, account, data) => {
  if (user.email === data.email) throw new httpError(400, 'Cant delete yourself');
  if (!account) throw new httpError(400, 'Account not exist');
  if (user.accountId === data.accountId || data.type !== 'admin') throw new httpError(400, 'It is not possible to delete a user who is not in your account');
  if (user.type !== 'user') throw new httpError(400, 'Unable to delete this user');
};

module.exports = { updateName, adminUpdateUser, deleteAuthorization };
