var editProfileBtn = document.getElementById('editProfileBtn');
var taskId = document.getElementById('taskId');

// ADD / EDIT PHOTO
document.getElementById('addEditPhoto').addEventListener('click', () => {
    // made the photo modal appear
    var photoModal = document.getElementById('photoModal');
    photoModal.style.display = 'block';
    
})

// UPDATE USER
editProfileBtn.addEventListener('click', () => {
    // make the user modal appear
    var profileEditModal = document.getElementById('profileEditModal');
    profileEditModal.style.display = 'block';

    // prefill fields
    var editName = document.getElementById('editName');
    var nameContent = document.getElementById('nameContent');
    editName.value = nameContent.innerHTML;
    // (password fields are blank)
    let pass1= document.getElementById('editPass1');
    let pass2= document.getElementById('editPass2');
    pass1.value = "";
    pass2.value = "";
    
    // cancel edit username
    document.getElementById('cancelNameEditBtn').addEventListener('click', () => {
        profileEditModal.style.display = 'none';
    });
    
    // apply User Edits button
    document.getElementById('applyNameEditBtn').addEventListener('click', () => {
        profileEditModal.style.display = 'none';
        if (pass1.value !== pass2.value) {
            let message = document.getElementsByClassName('message')[0];
            message.textContent = 'Passwords do not match.';
        } else {
            // get the new vlaue
            let name = editName.value; 
            let password = pass1.value;
            
            let fetchData = {
                method: 'PATCH',
                body: JSON.stringify({ name, password }),
                headers: { 'Content-Type': 'application/json; charset=UTF-8'}
            };
            fetch('users', fetchData)
                .then(response => response.json())
                .then(text => {
                    console.log(text);
                })
                .catch( err => console.log(err));
            setTimeout(() => {
                window.location.reload(true);
            }, 500);
        }
    });
});

// DELETE USER
document.getElementById('delAccountBtn').addEventListener('click', () => {
    // show modal
    var userDeleteModal = document.getElementById('userDeleteModal');
    userDeleteModal.style.display = 'block';

    // cancel delete
    document.getElementById('cancelAccountDeleteBtn').addEventListener('click', () => {
        userDeleteModal.style.display = 'none';
    });
    
    // delete
    // dealt with in users router
});

// DELETE TASK
document.getElementById('delTaskBtn').addEventListener('click', () => {
    // show modal
    document.getElementById('taskDeleteModal').style.display = 'block';

    // cancel delete
    document.getElementById('cancelTaskDeleteBtn').addEventListener('click', () => {
        taskDeleteModal.style.display = 'none';
    });
    
    // delete
    document.getElementById('applyTaskDeleteBtn').addEventListener('click', () => {
        taskDeleteModal.style.display = 'none';
        var data = { id: taskId.textContent };
        let fetchData = {
            method : 'DELETE',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        };
        fetch('tasks', fetchData)
        .then(response => response.json())
        .then(text => {
            console.log(text);
        })
        .catch( err => console.log(err));
        window.location.reload(true);
    });
});

// UPDATE TASK
document.getElementById('editTaskBtn').addEventListener('click', () => {
    // make the modal appear
    var taskEditModal = document.getElementById('taskEditModal');
    taskEditModal.style.display = 'block';
    // prefill fields
    var editDescription = document.getElementById('editDescription');
    var taskContent = document.getElementById('taskContent');
    editDescription.value = taskContent.innerHTML;
    var editStatus = document.getElementById('editStatus');
    var taskStatus = document.getElementById('taskStatus');
    editStatus.value = taskStatus.innerHTML;

    // cancel Task Edits button
    document.getElementById('cancelTaskEditBtn').addEventListener('click', () => {
        taskEditModal.style.display = 'none';
    });

    // apply Task Edits button
    document.getElementById('applyTaskEditBtn').addEventListener('click', () => {
        taskEditModal.style.display = 'none';
        let owner = taskId.textContent;
        let description = editDescription.value; 
        let complete = editStatus.value;
        var data = { owner, description, complete };
        
        let fetchData = {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        };
        fetch('tasks', fetchData)
            .then(response => response.json())
            .then(text => {
                console.log(text);
            })
            .catch( err => console.log(err));
        window.location.reload(true);
    });
});