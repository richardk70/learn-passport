var messageModal = document.getElementById('messageModal');
var newMessageBtn = document.getElementById('newMessageBtn');
newMessageBtn.addEventListener('click', () => {
    messageModal.style.display = 'block';
    let box = newMessageBtn.getBoundingClientRect();
    messageModal.style.top = box.top + 80 + 'px';
    messageModal.style.left = box.left + 'px';
});

// send message
document.getElementById('sendMessageBtn').addEventListener('click', () => {
    let to = document.getElementById('toField').value;
    let subject = document.getElementById('subjectField').value;
    let body = document.getElementById('bodyField').value;
    messageModal.style.display = 'none';
    console.log(`${to}, ${subject}, ${body}`);
});

// cancel
document.getElementById('cancelMessageBtn').addEventListener('click', () => {
    messageModal.style.display = 'none';
});