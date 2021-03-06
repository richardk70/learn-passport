var editProfileBtn = document.getElementById('editProfileBtn');
var addEditPhoto = document.getElementById('addEditPhoto');
const delAccountBtn = document.getElementById('delAccountBtn');

const taskList = document.getElementById('task-list');
taskList.addEventListener('click', (e) => {
    // get the index number
    let idString = "" + e.target.id;
    let i = idString.substring(idString.length - 1, idString.length);
    console.log(i);
    // get the function clicked
    // call the appropriate function for that array index
    if (e.target.matches('.fa-trash-alt')) {
        deleteTask(i);
    }
    if (e.target.matches('.fa-edit')) {
        editTask(i);
    }
    if (e.target.matches('.fa-camera')) {
        photoTask(i);
    }
});

// DELETE TASK
function deleteTask(i) {
    var taskId = document.getElementById(`taskId${i}`);
    console.log(taskId);
    var delTaskBtn = document.getElementById(`delTask${i}`);
    // show modal
    let box = delTaskBtn.getBoundingClientRect();
    let taskDeleteModal = document.getElementById('taskDeleteModal');
    taskDeleteModal.style.display = 'block';
    taskDeleteModal.style.top = box.top + 'px';
    taskDeleteModal.style.left = box.left - 100 + 'px';

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
        fetch('/tasks', fetchData)
        .then(response => response.json())
        .then(text => {
            console.log(text);
        })
        .catch( err => console.log(err));
        window.location.reload(true);
    });
}

// UPDATE TASK
function editTask(i) {
    let taskId = document.getElementById(`taskId${i}`);
    var editTaskBtn = document.getElementById(`editTask${i}`);
    // make the modal appear
    let box = editTaskBtn.getBoundingClientRect();
    var taskEditModal = document.getElementById('taskEditModal');
    taskEditModal.style.display = 'block';
    taskEditModal.style.top = box.top + 'px';
    taskEditModal.style.left = box.left + 'px';

    // prefill fields
    var editDescription = document.getElementById('editDescription');
    var taskContent = document.getElementById(`taskContent${i}`);
    editDescription.value = taskContent.innerHTML;
    var editStatus = document.getElementById('editStatus');
    var taskStatus = document.getElementById(`taskStatus${i}`);
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
        async function go() {
            let response = await fetch('/tasks', fetchData);
            let responseJSON = await response.json();
            let fromServer = responseJSON.myString;
            console.log(fromServer);
        }
        go();
            // .catch( err => console.log(err));
        window.location.reload(true);
    });
}

// ADD / EDIT TASK PHOTO
function photoTask(i) {
    var taskId = document.getElementById(`taskId${i}`);
    let photoTaskBtn = document.getElementById(`photoTask${i}`);
    let box = photoTaskBtn.getBoundingClientRect();

    // made the photo modal appear in appropriate spot
    var taskPhotoModal = document.getElementById('taskPhotoModal');
    taskPhotoModal.style.display = 'block';
    taskPhotoModal.style.top = box.top + 'px';
    taskPhotoModal.style.left = box.left + 'px';

    // show ID
    let taskNum = document.getElementById('taskNum');
    taskNum.value = taskId.innerHTML;

    // cancel button
    document.getElementById('cancelTaskAddPhotoBtn').addEventListener('click', () => {
        taskPhotoModal.style.display = 'none';
    });

    // apply Use This Photo button?
    document.getElementById('applyTaskAddPhotoBtn').addEventListener('click', () => {
        taskPhotoModal.style.display = 'none';
    });
}

// ADD / EDIT USER PHOTO
addEditPhoto.addEventListener('click', () => {
    let box = addEditPhoto.getBoundingClientRect();

    // made the photo modal appear in appropriate spot
    var userPhotoModal = document.getElementById('userPhotoModal');
    userPhotoModal.style.display = 'block';
    userPhotoModal.style.top = box.top + 'px';
    userPhotoModal.style.left = box.left + 'px';

    // cancel button
    document.getElementById('cancelUserAddPhotoBtn').addEventListener('click', () => {
        userPhotoModal.style.display = 'none';
    });

    // apply Use This Photo button?
    document.getElementById('applyUserAddPhotoBtn').addEventListener('click', () => {
        userPhotoModal.style.display = 'none';
    });
});

// UPDATE USER
editProfileBtn.addEventListener('click', () => {
    // make the user modal appear in appropriate spot
    let box = editProfileBtn.getBoundingClientRect();
    var profileEditModal = document.getElementById('profileEditModal');
    profileEditModal.style.display = 'block';
    profileEditModal.style.top = box.top + 30 + 'px';
    profileEditModal.style.left = box.left + 'px';

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
            fetch('/users', fetchData)
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
delAccountBtn.addEventListener('click', () => {
    let box = delAccountBtn.getBoundingClientRect();
    // show modal
    var userDeleteModal = document.getElementById('userDeleteModal');
    userDeleteModal.style.display = 'block';
    userDeleteModal.style.top = box.top + 'px';
    userDeleteModal.style.left = box.left - (box.width/2) + 'px';

    // cancel delete
    document.getElementById('cancelAccountDeleteBtn').addEventListener('click', () => {
        userDeleteModal.style.display = 'none';
    });
    
    // delete
    // dealt with in users router
});

