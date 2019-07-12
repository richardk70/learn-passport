var inviteFriendsModal = document.getElementById('inviteFriendsModal');
var inviteFriendsBtn = document.getElementById('inviteFriendsBtn');
inviteFriendsBtn.addEventListener('click', () => {
    inviteFriendsModal.style.display = 'block';
    let box = inviteFriendsBtn.getBoundingClientRect();
    inviteFriendsModal.style.top = box.top + 60 + 'px';
    inviteFriendsModal.style.left = box.left + 'px';
});

// invite friend
document.getElementById('sendInviteBtn').addEventListener('click', () => {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    inviteFriendsModal.style.display = 'none';
    console.log(`${name}, ${email}`);
});

// cancel
document.getElementById('cancelInviteBtn').addEventListener('click', () => {
    inviteFriendsModal.style.display = 'none';
});