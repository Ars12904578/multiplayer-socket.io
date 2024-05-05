const socket = io();
let username = sessionStorage.getItem("name");
function loop_name() {if (!username) {
username = prompt('Enter your name:');
if (username) {socket.emit('player', username);
sessionStorage.setItem("name", username);
socket.emit('message', `${username} joined`);
} else {loop_name();}}};loop_name();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
form.addEventListener('submit', function(event) {
event.preventDefault();if (input.value) {
var messagetosent = `${username}:  ${input.value}`
socket.emit('message', messagetosent);input.value = '';}});
socket.on('message', function(data) {
document.querySelector('.chat_latest').textContent = `Chat [${data}]`
const item = document.createElement('li');
item.textContent = data;messages.appendChild(item);
window.scrollTo(0, document.body.scrollHeight);});
window.addEventListener('beforeunload', function() {
socket.emit('disconnect');});function makeDraggable(element) {
let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
element.addEventListener('mousedown', dragMouseDown);
element.addEventListener('touchstart', dragMouseDown);
function dragMouseDown(e) {e = e || window.event;e.preventDefault();
pos3 = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
pos4 = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
document.addEventListener('mouseup', closeDragElement);
document.addEventListener('touchend', closeDragElement);
document.addEventListener('touchmove', elementDrag);
document.addEventListener('mousemove', elementDrag);
}function elementDrag(e) {e = e || window.event;
pos1 = pos3 - (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX);
pos2 = pos4 - (e.type === 'mousemove' ? e.clientY : e.touches[0].clientY);
pos3 = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
pos4 = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
element.style.top = (element.offsetTop - pos2) + "px";
element.style.left = (element.offsetLeft - pos1) + "px";
if (element.id == "summons1" || element.id == "summons2" || element.id == "summons3"){}
else{socket.emit('position', { id: element.id, x: element.offsetLeft, y: element.offsetTop });}
}function closeDragElement() {document.removeEventListener('mouseup', closeDragElement);
document.removeEventListener('mousemove', elementDrag);
document.removeEventListener('touchend', closeDragElement);
document.removeEventListener('touchmove', elementDrag);}}


// var soldier_counter = {};

// function counter(type, team, action) {
// if (action === 'add') {
// type[team] = (type[team] || 0) + 1;
// } else if (action === 'minus') {
// type[team] = (type[team] || 0) - 1;
// if (type[team] < 0) {type[team] = 0;
// }}else if (action === 'null'){return type[team];}
// return type[team];
// };
function summon(team){
        
    // if (!soldier_counter.hasOwnProperty(team)) {
    // counter(soldier_counter, team, 'null');}

;document.querySelector("#summon").innerHTML = `<div id="summons${team}">

    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Untitled7.png')">
    Capital
    </button>
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Untitled6.png')">
    City
    </button>
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Untitled8.png')">
    Town
    </button>
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Untitled.png')">
    Soldier
    </button>
    <br />
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Untitled1.png')">
    Car
    </button>
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Untitled3.png')">
    Tank
    </button>
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Untitled2.png')">
    Air
    </button>
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Untitled5.png')">
    Factory
    </button>
    <br />
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Road.png')">
    Road
    </button>
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Road.png')">
    Road x2
    </button>
    <button class="b-${team}" onclick="add_d_elem(${team}, 'Textures/Road.png')">
    Road x3
    </button>
</div>`;

makeDraggable(document.querySelector(`#summons${team}`));}
function addElement(id, x, y, team, src) {const newElement = document.createElement('img');newElement.id = id;newElement.classList.add(`draggable${team}`);if (team == 3){newElement.style.right = x + 'px';newElement.style.bottom = y + 'px';}if (team == 2){newElement.style.right = x + 'px';newElement.style.top = y + 'px';}if (team == 1){newElement.style.left = x + 'px';newElement.style.top = y + 'px';}
newElement.src = src;document.body.appendChild(newElement);makeDraggable(newElement);newElement.addEventListener('dblclick', () =>{
newElement.remove();socket.emit('removeElement', newElement.id);});let touchTimer;newElement.addEventListener('touchstart', function(event) {touchTimer = setTimeout(function() {
newElement.remove();socket.emit('removeElement', newElement.id);console.log('Long press');}, 500);});newElement.addEventListener('touchmove', function(event) {clearTimeout(touchTimer);});newElement.addEventListener('touchend', function(event) {clearTimeout(touchTimer);});
};function add_d_elem(team, src) {const id = Date.now().toString(), x = 0, y = 0;
    addElement(id, x, y, team, src);
    socket.emit('newElement', { id, x, y, team, src });
};
socket.on('newElement', function(data) {const existingElement = document.getElementById(data.id);if(existingElement){}else{
    addElement(data.id, data.x, data.y, data.team, data.src);
}});
// ----

function detectOrientation() {
    if (!document.fullscreenElement) {
        document.querySelector('.playerblocker').classList.remove('hidden');
    } else if (document.fullscreenElement) {
        document.querySelector('.playerblocker').classList.add('hidden');
    }
}

window.addEventListener("orientationchange", detectOrientation);
window.addEventListener("resize", detectOrientation);
window.addEventListener("DOMContentLoaded", detectOrientation);
detectOrientation();
window.addEventListener("touchstart", detectOrientation);
window.addEventListener("touchend", detectOrientation);
window.addEventListener("touchmove", detectOrientation);


socket.on('playersCount', function(data){document.querySelector(".playerCount").innerHTML = "Player Count "+data});
socket.on('position', function(data) {const element = document.getElementById(data.id);
if (element) {element.style.left = data.x + 'px';element.style.top = data.y + 'px';
}});socket.on('removeElement', function(id) {const elementToRemove = document.getElementById(id);
if (elementToRemove) {elementToRemove.remove();}});
const fullscreenButton = document.getElementById('fullscreenButton');
fullscreenButton.addEventListener('click', () => {toggleFullscreen();
});function toggleFullscreen() {if (!document.fullscreenElement) {fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>'
document.documentElement.requestFullscreen().catch(err => {
console.error('Failed to enter fullscreen mode:', err);});} else {
if (document.exitFullscreen) {document.exitFullscreen();fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>'}}}