const valid = require('./validatorService');

const validation = (req, res, next) => {
  try {
    if (req.body.email) valid.emailValidator(req.body.email);
    if (req.body.password) valid.PasswordValidator(req.body.password);
    if (req.body.name || req.body.name === '') valid.nameValidator(req.body.name);
    if (req.body.code) valid.codeValidator(req.body.code);
    if (req.body.newPassword) valid.PasswordValidator(req.body.newPassword);
    if (req.body.status) valid.statusValidator(req.body.status);
    if (req.body.type) valid.typeValidator(req.body.type);
    if (req.body.suspensionTime) valid.suspensionTimeValidator(req.body.suspensionTime);

    next();
  } catch (err) {
    res.status(412)
      .json({
        success: false,
        message: err.message,
      });
  }
};

module.exports = { validation };
