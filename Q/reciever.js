// eslint-disable-next-line import/no-unresolved
const amqp = require('amqplib/callback_api');

const { QUpdateAccount } = require('../services/accountService');
const { QSuspendAccount } = require('../services/accountService');

const { listenSubscription } = process.env;
const { listenSuspendedAccount } = process.env;

const listenToQ = () => {
  amqp.connect(listenSubscription, (err, conn) => {
    conn.createChannel((err, ch) => {
      const q = 'CloudAMQP';
      console.log('waiting message from %s', q);
      ch.consume(q, (msg) => {
        const qm = (JSON.parse(msg.content.toString()));
        QUpdateAccount(qm);
        console.log(qm.accountId);
        console.log(qm.seats);
        console.log(qm.features);
        console.log(qm.credits);
      }, { noAck: true });
    });
  });

  // receive suspended acoount from the billing

  amqp.connect(listenSuspendedAccount, (err, conn) => {
    conn.createChannel((err, ch) => {
      const q = 'CloudAMQP';
      console.log('waiting message from %s', q);
      ch.consume(q, (msg) => {
        const qm = (JSON.parse(msg.content.toString()));
        QSuspendAccount(qm);
        console.log(qm.accountId);
      }, { noAck: true });
    });
  });
};

module.exports = { listenToQ };
