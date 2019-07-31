
// upon page load
const folders = document.getElementById('folders');
const main = document.getElementById('main');

// app should reach out to DB and download all of the email message folders
let data = document.getElementById('data').innerHTML;
let allMessages = JSON.parse(data);

// break into 4 separate arrays by folder schema setting
// display 'Inbox' messages by default
// event listener on folder list.
let inbox = allMessages.filter( message => message.folder == 'inbox');
let sent = allMessages.filter( message => message.folder == 'sent');
let deleted = allMessages.filter( message => message.folder == 'deleted');

function displayMessages(folder) {
    let str = ""
    for (message of folder) {
        str = str + `<div>${message.from}<br>${message.to}<br>
                ${message.subject}<br>
                ${message.body}</div>`; 
    }
    return str;
}

folders.addEventListener('click', (e) => {
    if (e.target.id == 'inbox') {
        main.innerHTML = displayMessages(inbox);
    }
    if (e.target.id == 'sent') {
        main.innerHTML = displayMessages(sent);
    }
    if (e.target.id == 'deleted') {
        main.innerHTML = displayMessages(deleted);    }
})