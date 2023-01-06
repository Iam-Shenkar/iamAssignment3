const amqp = require('amqplib/callback_api');

const { listenSubscription } = process.env;

// receive message from the billing

amqp.connect(listenSubscription, (err, conn) => {
  console.log('test');
  conn.createChannel((err, ch) => {
    const q = 'CloudAMQP';
    console.log('waiting message from %s', q);
    ch.consume(q, (msg) => {
      const qm = (JSON.parse(msg.content.toString()));
      console.log(qm);
    }, { noAck: true });
  });
});
