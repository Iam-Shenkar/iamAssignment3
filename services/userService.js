const { httpError } = require('../class/httpError');
const { User } = require('./authService');

const updateName = async (user, data) => {
  if (user.email !== data.email) throw new httpError(400, 'you cant update this user');
  if (user.status !== 'active') throw new httpError(400, 'user is closed');
  await User.update({ email: user.email }, { name: data.name });
};

const adminUpdateUser = async (data) => {
  const user = await User.retrieve(data.email);
  if (user.role === 'manager' && data.status === 'closed') throw new httpError(400, 'you cant update this user');

  const updateData = {
    name: data.name,
    role: data.role,
    status: data.status,
  };
  if (data.status === 'suspended') {
    const suspensionData = {
      suspensionTime: data.suspensionTime,
      suspensionDate: data.suspensionDate,
    };
    Object.assign(updateData, suspensionData);
  }
  await User.update({ email: user.email }, { updateData });
};

module.exports = { updateName, adminUpdateUser };
