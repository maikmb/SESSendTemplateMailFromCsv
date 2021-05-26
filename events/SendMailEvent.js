const events = require('events');
let sendCount = 0;

const onSend = () => {
    console.log(`Total sended: ${sendCount++}`)
}

const sendEmailEmitter = new events.EventEmitter();
sendEmailEmitter.on('send', onSend);

module.exports = { sendEmailEmitter }