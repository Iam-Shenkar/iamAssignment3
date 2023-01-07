// eslint-disable-next-line import/no-unresolved
const amqp = require('amqplib/callback_api');

const { amqpCreateFreePlan } = process.env;
const { amqpSuspendedAccount } = process.env;

// sending create free plan to the billing

const freePlan2Q = async (accountId) => {
  amqp.connect(amqpCreateFreePlan, (err, conn) => {
    conn.createChannel(async (err, ch) => {
      const q = 'CloudAMQP';
      const freePlan = {
        accountId: { accountId },
      };
      const stringMsg = JSON.stringify(freePlan);
      ch.assertQueue(q, { durable: false });
      await ch.sendToQueue(q, Buffer.from(stringMsg));
    });
  });
};

// sending suspended Account to the billing

const newStatus2Q = async (accountId, status) => {
  amqp.connect(amqpSuspendedAccount, (err, conn) => {
    conn.createChannel(async (err, ch) => {
      const q = 'CloudAMQP';
      const suspendedAccount = {
        accountId: { accountId },
        status: { status },
      };
      const stringMsg = JSON.stringify(suspendedAccount);
      ch.assertQueue(q, { durable: false });
      await ch.sendToQueue(q, Buffer.from(stringMsg));
    });
  });
};

// newStatus2Q("17774","suspended");
//
// freePlan2Q("1234");

freePlan2Q('1234');

module.exports = { freePlan2Q, newStatus2Q };
