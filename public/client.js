const socket = io();
let username = sessionStorage.getItem("name");

function loop_name() {
    if (!username) {
        username = prompt('Enter your name:');
        if (username) {
            sessionStorage.setItem("name", username);
            socket.emit('player', username)
            socket.emit('message', `${username} Joined`);
        } else {
            loop_name();
        }
    }
}
loop_name();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (input.value) {
        var messagetosent = `${username}:  ${input.value}`
        socket.emit('message', messagetosent);
        input.value = '';
    }
});

socket.on('message', function(data) {
    const item = document.createElement('li');
    item.textContent = data;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

window.addEventListener('beforeunload', function() {
    socket.emit('disconnect');
});

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.addEventListener('mousedown', dragMouseDown);
    element.addEventListener('touchstart', dragMouseDown);

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        pos4 = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('touchend', closeDragElement);
        document.addEventListener('touchmove', elementDrag);
        document.addEventListener('mousemove', elementDrag);
    }

    function elementDrag(e) {
        e = e || window.event;
        pos1 = pos3 - (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX);
        pos2 = pos4 - (e.type === 'mousemove' ? e.clientY : e.touches[0].clientY);
        pos3 = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        pos4 = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        // Send the element's position to the server
        socket.emit('position', { id: element.id, x: element.offsetLeft, y: element.offsetTop });
    }

    function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('touchend', closeDragElement);
        document.removeEventListener('touchmove', elementDrag);
    }
}


function addDraggableElement(id, x, y) {
    const newElement = document.createElement('div');
    newElement.id = id;
    newElement.classList.add('draggable');
    newElement.style.position = 'absolute';
    newElement.style.width = '100px';
    newElement.style.height = '100px';
    newElement.style.backgroundColor = 'blue';
    newElement.style.left = x + 'px';
    newElement.style.top = y + 'px';
    document.body.appendChild(newElement);
    makeDraggable(newElement);
    newElement.addEventListener('dblclick', () =>{
        newElement.remove();
        socket.emit('removeElement', newElement.id);
    });
let touchTimer;
newElement.addEventListener('touchstart', function(event) {
    touchTimer = setTimeout(function() {
        newElement.remove();
        socket.emit('removeElement', newElement.id);
        console.log('Long press detected');
    }, 1000);
});

newElement.addEventListener('touchmove', function(event) {
    clearTimeout(touchTimer);
});

newElement.addEventListener('touchend', function(event) {
    clearTimeout(touchTimer);
});

}

document.getElementById('addButton').addEventListener('click', function() {
    const id = Date.now().toString(); // Unique ID for each element
    const x = Math.random() * (window.innerWidth - 100); // Random X position
    const y = Math.random() * (window.innerHeight - 100); // Random Y position
    addDraggableElement(id, x, y);
    socket.emit('newElement', { id, x, y });
});

socket.on('position', function(data) {
    const element = document.getElementById(data.id);
    if (element) {
        element.style.left = data.x + 'px';
        element.style.top = data.y + 'px';
    }
});

socket.on('removeElement', function(id) {
    const elementToRemove = document.getElementById(id);
    if (elementToRemove) {
        elementToRemove.remove(); // Remove the corresponding element from other clients
    }
});

socket.on('newElement', function(data) {
    const existingElement = document.getElementById(data.id);
    if (existingElement) {
    }else{
        addDraggableElement(data.id, data.x, data.y);
    }
});

const fullscreenButton = document.getElementById('fullscreenButton');
fullscreenButton.addEventListener('click', () => {toggleFullscreen();
});function toggleFullscreen() {if (!document.fullscreenElement) {fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>'
document.documentElement.requestFullscreen().catch(err => {
console.error('Failed to enter fullscreen mode:', err);});} else {
if (document.exitFullscreen) {document.exitFullscreen();fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>'}}}