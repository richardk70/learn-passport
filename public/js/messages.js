// js/messages.js

var messageModal = document.getElementById('messageModal');
var newMessageBtn = document.getElementById('newMessageBtn');
newMessageBtn.addEventListener('click', () => {
    messageModal.style.display = 'block';
    let box = newMessageBtn.getBoundingClientRect();
    messageModal.style.top = box.top + 120 + 'px';
    messageModal.style.left = box.left + 'px';
});

// create and send message
// document.getElementById('sendMessageBtn').addEventListener('click', () => {
//     let to = document.getElementById('toField').value;
//     let subject = document.getElementById('subjectField').value;
//     let body = document.getElementById('bodyField').value;
//     messageModal.style.display = 'none';
//     console.log(`${to}, ${subject}, ${body}`);
// });

// SAVE MESSAGE FOR LATER
document.getElementById('saveMessageBtn').addEventListener('click', () => {
    messageModal.style.display = 'none';
});

// CANCEL MESSAGE
document.getElementById('cancelMessageBtn').addEventListener('click', () => {
    messageModal.style.display = 'none';
});

// DELETE MESSAGE
const messageList = document.getElementById('message-list');
messageList.addEventListener('click', (e) => {
    // get the index number
    let idString  = "" + e.target.id;
    let i = idString.substring(idString.length - 1, idString.length);
    if (e.target.matches('.fa-trash-alt'))
        deleteMessage(i);
});

function deleteMessage(i) {
    let messageId = document.getElementById(`messageId${i}`);
    console.log(messageId);
    var data = { id: messageId.textContent };
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
}