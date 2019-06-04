var delBtn = document.getElementById('delBtn');
var editBtn = document.getElementById('editBtn');
var taskId = document.getElementById('taskId');

// DELETE
delBtn.addEventListener('click', (e) => {
    // console.log(e.target.id);
    var data = { id: taskId.textContent };
    let fetchData = {
        method : 'DELETE',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json; charset=UTF-8'}
    };
    getData(fetchData);
});

// UPDATE 
editBtn.addEventListener('click', () => {
    // make the modal appear
    var modal = document.getElementById('editModal');
    modal.style.display = 'block';
    var editDescription = document.getElementById('editDescription');
    var taskContent = document.getElementById('taskContent');
    editDescription.value = taskContent.innerHTML;
    var editStatus = document.getElementById('editStatus');
    // var data = { id: taskId.textContent };
    // let fetchData = {
    //     method: 'PATCH',
    //     body: JSON.stringify(data),
    //     headers: { 'Content-Type': 'application/json; charset=UTF-8'}
    // };
    // getData(fetchData);
});

function getData(fetchData) {
    fetch('tasks', fetchData)
    .then(response => response.json())
    .then(text => {
        console.log(text);
    })
    .catch( err => console.log(err));
}