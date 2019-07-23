var inviteFriendsModal = document.getElementById('inviteFriendsModal');
var inviteFriendsBtn = document.getElementById('inviteFriendsBtn');
inviteFriendsBtn.addEventListener('click', () => {
    inviteFriendsModal.style.display = 'block';
    let box = inviteFriendsBtn.getBoundingClientRect();
    inviteFriendsModal.style.top = box.top + 60 + 'px';
    inviteFriendsModal.style.left = box.left + 'px';
}, false);


// invite friend
document.getElementById('sendInviteBtn').addEventListener('click', () => {
    let invites = [];
    let user = {};
    // create arrays for names and emails
    let nameInputs = Array.from(document.getElementsByName('name-input'));
    let emailInputs = Array.from(document.getElementsByName('email-input'));
    // loop through the arrays and push user object onto invites array
    for (var i = 0; i < nameInputs.length-1; i++) {
        user.name = nameInputs[i].value;
        user.email = emailInputs[i].value;
        invites.push(user);
        user = {};
    }

    console.log(invites);
    // send the invites array to the web server
    let fetchData = {
        method : 'POST',
        body: JSON.stringify(invites),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    };
    fetch('/friends', fetchData)
    .then(response => response.json())
    .then(text => {
        console.log(text);
    })
    .catch( err => console.log(err));
    // window.location.reload(true);
    
    inviteFriendsModal.style.display = 'none';
}, false);


function removeElementsByClassName(els) {
    while (els.length > 0)
        els[0].parentNode.removeChild(els[0]);
}

// cancel
document.getElementById('cancelInviteBtn').addEventListener('click', () => {
    // eliminate all extra rows
    var extras = document.getElementsByClassName('extra');
    removeElementsByClassName(extras)

    // clear the input fields on first row
    document.getElementsByName('name-input')[0].value = "";
    document.getElementsByName('email-input')[0].value = "";

    // modal disappears
    inviteFriendsModal.style.display = 'none';
}, false);

function validateEmail(emailValue) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailValue).toLowerCase());
}

function addEmailLine(e) {
    // get the array of all email fields
    let emailInputs = document.getElementsByName('email-input');
    let l = emailInputs.length;
    if (l > 0) {
        let nameInput = document.getElementsByName('name-input')[l-1];
        let emailValue = emailInputs[l-1].value + e.key;
        if (validateEmail(emailValue) && nameInput.value.length > 0) {
            // create a new line of input fields for name and email
            console.log('email found');
            var newRow = document.createElement('DIV');
            newRow.className = 'row extra';
            newRow.innerHTML = `
                <span class='cell'><input type='text' name='name-input'></span>
                <span class='cell'><input type='text' name='email-input'></span>
                `;
            const friendList = document.getElementById('friend-list');
            friendList.appendChild(newRow);
        } 
    }
}

inviteFriendsModal.addEventListener('keydown', (e) => {
    addEmailLine(e);
}, true);
