const sgAPIKey = process.env.SG;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sgAPIKey);


const sendInviteEmail = (email, name, fromName, fromEmail) => {
    const msg = {
        to: email,
        from: 'a_friend@sharedtasks.com',
        subject: `${fromName} has invited you to the Shared Task App!`,
        text: `Welcome to the app, ${name}.`,
        html: `
        <h1>Welcome ${name} to sharedtasks.com.</h1>
        <p>Click <a href="www.friendcrash.com/register?name=${name}&email=${email}&referredBy=${fromEmail}">here</a> to register.</p>
        `
    };
    sgMail.send(msg);
}

const sendCancelEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'admin@sharedtasks.com',
        subject: 'Sorry to see you go',
        text: `May we ask why you are leaving sharedtasks.com, ${name}?`
    };
    sgMail.send(msg);
}

module.exports = {
    sendInviteEmail: sendInviteEmail,
    sendCancelEmail: sendCancelEmail
}