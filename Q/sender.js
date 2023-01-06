const amqp = require('amqplib/callback_api');

const { amqpCreateFreePlan } = process.env;
const { amqpSuspendedAccount } = process.env;

// sending create free plan to the billing

const freePlan2Q = async (accountID) => {
  const q = 'CloudAMQP';
  amqp.connect(amqpCreateFreePlan, (err, conn) => {
    conn.createChannel(async (ch) => {
      const freePlan = {
        accountId: accountID,
      };
      const stringMsg = JSON.stringify(freePlan);
      ch.assertQueue(q, { durable: false });
      await ch.sendToQueue(q, Buffer.from(stringMsg));

      // logger.info(`RMQ- update free plan message : ${account_id} with: ${credits} credits`);
    });
  });
};

// sending suspended Account to the billing

const newStatus2Q = async (accountID, status) => amqp.connect(amqpSuspendedAccount, (err, conn) => {
  conn.createChannel(async (ch) => {
    const q = 'CloudAMQP';
    const suspendedAccount = {
      accountId: accountID,
      status,
    };
    const stringMsg = JSON.stringify(suspendedAccount);
    ch.assertQueue(q, { durable: false });
    await ch.sendToQueue(q, Buffer.from(stringMsg));

    // insert to logger.
    // logger.info(`RMQ- update free plan message : ${account_id} with: ${credits} credits`);
  });
});

module.exports = { freePlan2Q, newStatus2Q };
