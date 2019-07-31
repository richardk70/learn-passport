// js/messages.js

var newMessageModal = document.getElementById('newMessageModal');
const previews = document.getElementById('previews');
const main = document.getElementById('main');
let message = {};

// NEW MESSAGE MODAL ///////////////////////////////////////////////
var newMessageBtn = document.getElementById('newMessageBtn');
newMessageBtn.addEventListener('click', () => {
    newMessageModal.style.display = 'block';
    let box = newMessageBtn.getBoundingClientRect();
    newMessageModal.style.top = box.top + 120 + 'px';
    newMessageModal.style.left = box.left + 'px';
});

// SAVE MESSAGE FOR LATER
document.getElementById('saveMessageBtn').addEventListener('click', () => {
    newMessageModal.style.display = 'none';
});

// CANCEL MESSAGE
document.getElementById('cancelMessageBtn').addEventListener('click', () => {
    newMessageModal.style.display = 'none';
});
///////////////////////////////////////////////////////////////////

// ALL MESSAGES
let data = document.getElementById('data').innerHTML;
let allMessages = JSON.parse(data);
// break into 4 separate arrays by folder schema setting
let inbox = allMessages.filter( message => message.folder == 'inbox');
let drafts = allMessages.filter( message => message.folder == 'drafts');
let sent = allMessages.filter( message => message.folder == 'sent');
let deleted = allMessages.filter( message => message.folder == 'deleted');

// display 'Inbox' messages by default
previews.innerHTML = displayMessages(inbox);

// FOLDERS
const folders = document.getElementById('folders');
folders.addEventListener('click', (e) => {
    // remove 'folder-active' class from all folders
    const allFolders = document.getElementsByClassName('folder');
    for (folder of allFolders) {
        folder.classList.remove('folder-active');
    }
    // add 'folder-active' for just the clicked folder
    document.getElementById(e.target.id).classList.add('folder-active');

    if (e.target.id == 'inbox') {
        previews.innerHTML = displayMessages(inbox);
    }
    if (e.target.id == 'drafts') {
        previews.innerHTML = displayMessages(drafts);
    }
    if (e.target.id == 'sent') {
        previews.innerHTML = displayMessages(sent);
    }
    if (e.target.id == 'deleted') {
        previews.innerHTML = displayMessages(deleted);
    }
});

// PREVIEW MESSAGES in PREVIEW pane
function displayMessages(folder) {
    main.innerHTML = `<div class='bordbot1'>Reading Pane</div>`;
    let str = "<div class='bordbot1'>Previews</div>"
    let i = 0;
    for (m of folder) {
        message = m;
        str = str + `
        <div class='preview-message' id='message${i}'>
            <div class='gone' id='id${i}'>${m._id}</div>
            <div class='row none'>
                <span class='cell' id='to${i}'>To: ${m.to}</span>
                <span class='cell' id='from${i}'>From: ${m.from}</span>
            </div>
            <div class='row none'>
                <span class='cell text09 flex4' id='subject${i}'>${m.subject}</span>
                <span class='cell text09 timestamps' id='timestamp${i}'>${m.createdAt}</span>
            </div>
            <div class='text08 none hidden' id='body${i}'>${m.body}</div>
        </div> 
                `; 
        i++;
    }
    return str;
}

previews.addEventListener('click', (e) => {
    main.innerHTML = "<div class='bordbot1'>Reading Pane</div>";
    let idString = e.target.id;
    let i = idString.substring(idString.length - 1, idString.length);
    // remove 'preview-message-active' class from all folders
    const previews = document.getElementsByClassName('preview-message');
    for (p of previews) {
        p.classList.remove('preview-message-active');
    }
    // add 'preview-message-active' class to clicked element
    document.getElementById(e.target.id).classList.add('preview-message-active');

    // get the content to display in the reading pane
    message.id = document.getElementById('id'+i).textContent;
    message.from = document.getElementById('from'+i).textContent;
    message.to = document.getElementById('to'+i).textContent;
    message.createdAt = document.getElementById('timestamp'+i).textContent;
    message.subject = document.getElementById('subject'+i).textContent;
    message.body = document.getElementById('body'+i).textContent;
    console.log(message);

    // create the divs
    // attach the variables as text nodes
    // attach the divs to main-pane div
    let idDiv = document.createElement('DIV');
    idDiv.classList.add('gone');
    idDiv.innerHTML = message.id;
    main.appendChild(idDiv);
    let fromDiv = document.createElement('DIV');
    fromDiv.innerHTML = message.from;
    main.appendChild(fromDiv);
    let timeDiv = document.createElement('DIV');
    timeDiv.innerHTML = message.createdAt;
    main.appendChild(timeDiv);
    let toDiv = document.createElement('DIV');
    toDiv.innerHTML = message.to;
    main.appendChild(toDiv);
    let subjectDiv = document.createElement('DIV');
    subjectDiv.innerHTML = message.subject;
    main.appendChild(subjectDiv);
    let bodyDiv = document.createElement('DIV');
    bodyDiv.innerHTML = message.body;
    main.appendChild(bodyDiv);
    main.innerHTML += `
        <button class="greenBG" id="replyMessage"><i class="fas fa-reply"></i>&nbsp;Reply</button>
        <button class="redBG" id="deleteMessage"><i class="fas fa-trash"></i>&nbsp;Delete</button>
    `;
    checkButtons(message);
}, true)


// DELETE MESSAGE
function checkButtons(message) {
    const deleteMessage = document.getElementById('deleteMessage');
    deleteMessage.addEventListener('click', () => {
        console.log('delete');
        var data = { id: message.id };
        let fetchData = {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        };
        fetch('/messages', fetchData)
            .then(response => response.json())
            .then(text => {
                    console.log(text);
            })
            .catch( err => console.log(err))
            window.location.reload(true);
    });
}

// format timestamp properly
let now = new Date().getTime(); // secs since 1970
let msSinceMidnight = new Date() - new Date().setHours(0,0,0,0); // ms since midnight
let secsSinceMidnight = msSinceMidnight/1000;
let minsSinceMidnight = Math.round((secsSinceMidnight/60)%60);
let minsRemaining = minsSinceMidnight%60;
let hrsSinceMidnight = minsSinceMidnight/60;
console.log(`${hrsSinceMidnight}:${minsRemaining}`);

let timestamps = document.getElementsByClassName('timestamps');
// go through all timestamp fields
// and convert the secs to time format

// get the current time in ms
// get the ms count from most recent midnight
// 
for (var i = 0; i < timestamps.length; i++) {
    let ageOfMessage = now - Number(timestamps[i].textContent)*1000; // age of messagse in milliseconds since it was created
    // if (ageOfMessage  < msSinceMidnight) {
    //     let secs = Math.round(ageOfMessage/1000); // age in seconds
    //     let s = secs%60; // leftover seconds
    //     let mins = Math.round(secs/60);    // minutes
    //     let m = mins%60;
    //     let hrs = Math.round(mins/60);           // hours
    //     let h = hrs%24;
    //     console.log(`ageOfMessage: ${ageOfMessage}. ${hrs}:${mins}`);
    //     timestamps[i].textContent = `${h}:${m}`;
    // } else {
    //     timestamps[i].textContent = '>1day';
    // }
}