var delBtn = document.getElementById('delBtn');
var editBtn = document.getElementById('editBtn');
var taskId = document.getElementById('taskId');

// DELETE
delBtn.addEventListener('click', (e) => {
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

// UPDATE 
editBtn.addEventListener('click', () => {
    // make the modal appear
    var modal = document.getElementById('editModal');
    modal.style.display = 'block';
    // prefill fields
    var editDescription = document.getElementById('editDescription');
    var taskContent = document.getElementById('taskContent');
    editDescription.value = taskContent.innerHTML;
    var editStatus = document.getElementById('editStatus');
    var taskStatus = document.getElementById('taskStatus');
    editStatus.value = taskStatus.innerHTML;
    var applyEditsBtn = document.getElementById('applyEditsBtn');
    applyEditsBtn.addEventListener('click', () => {
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
        modal.style.display = 'none';
        window.location.reload(true);
    });
});