// eslint-disable-next-line import/no-unresolved
const amqp = require('amqplib/callback_api');

const {QUpdateAccount} = require("../services/accountService");
const { QSuspendAccount } = require("../services/accountService");

const { listenSubscription } = process.env;
const { listenSuspendedAccount } = process.env;

// listenSubscription = "amqps://zjstebnk:IuwbScqxDJ68uBe0Ut7p7xTojpElpha3@rattlesnake.rmq.cloudamqp.com/zjstebnk"
// listenSuspendedAccount = "amqps://ojcxxjot:Rq04fJgu9hIxcrgkw-9pu8zCHN9RCQIR@rattlesnake.rmq.cloudamqp.com/ojcxxjot"

const listenToQ = () => {

    const q = 'CloudAMQP';
    console.log(`waiting message from %s`, q);
    amqp.connect(listenSubscription, (err, conn) => {
        conn.createChannel((err, ch) => {
            ch.consume(q, (msg) => {
                const qm = (JSON.parse(msg.content.toString()));
                QUpdateAccount(qm);
                console.log(qm.accountId);
                console.log(qm.seats);
                console.log(qm.features);
                console.log(qm.credits);
            }, {noAck: true});
        })
    })

//receive suspended account from the billing

    amqp.connect(listenSuspendedAccount, (err, conn) => {
        const q = 'CloudAMQP';
        conn.createChannel((err, ch) => {
            ch.consume(q, (msg) => {
                const qm = (JSON.parse(msg.content.toString()));
                QSuspendAccount(qm);
                console.log("got account");
                console.log(qm.accountId);
            }, {noAck: true});
        })
    })

}

module.exports = {listenToQ};
