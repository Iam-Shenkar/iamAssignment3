
const amqp = require('amqplib/callback_api');

const { QUpdateAccount } = require('../services/accountService');
const { QSuspendAccount } = require('../services/accountService');

const { listenSubscription } = process.env;
const { listenSuspendedAccount } = process.env;

const listenToQ = () => {

    const q = 'CloudAMQP';
    console.log(`waiting for a message from Billing in %s`, q);
    amqp.connect(listenSubscription, (err, conn) => {
        conn.createChannel((err, ch) => {
            ch.consume(q, (msg) => {
                const qm = (JSON.parse(msg.content.toString()));
                QUpdateAccount(qm);
            }, {noAck: true});
        })
    })


    amqp.connect(listenSuspendedAccount, (err, conn) => {
        const q = 'CloudAMQP';
        conn.createChannel((err, ch) => {
            ch.consume(q, (msg) => {
                const qm = (JSON.parse(msg.content.toString()));
                QSuspendAccount(qm);
            }, {noAck: true});
        })
    })

}

module.exports = {listenToQ};

