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
socket.emit('position', { id: element.id, x: element.offsetLeft, y: element.offsetTop });
}function closeDragElement() {document.removeEventListener('mouseup', closeDragElement);
document.removeEventListener('mousemove', elementDrag);
document.removeEventListener('touchend', closeDragElement);
document.removeEventListener('touchmove', elementDrag);}}


// ----
function addSoldierElement(id, x, y, team) {const newElement = document.createElement('img');newElement.id = id;newElement.classList.add(`draggable${team}`);
    newElement.src = "/Textures/Untitled.png"
    newElement.style.left = x + 'px';newElement.style.top = y + 'px';document.body.appendChild(newElement);makeDraggable(newElement);newElement.addEventListener('dblclick', () =>{newElement.remove();socket.emit('removeElement', newElement.id);});let touchTimer;newElement.addEventListener('touchstart', function(event) {touchTimer = setTimeout(function() {newElement.remove();socket.emit('removeElement', newElement.id);console.log('Long press');}, 500);});newElement.addEventListener('touchmove', function(event) {clearTimeout(touchTimer);});newElement.addEventListener('touchend', function(event) {clearTimeout(touchTimer);});
};
function addsoldier(Team) {const id = Date.now().toString(), x = 0, y = 0;
    addSoldierElement(id, x, y, Team)
    socket.emit('newElement', { id, x, y, Team });
}
// ----

socket.on('newElement', function(data) {const existingElement = document.getElementById(data.id);if(existingElement){}else{
addDraggableElement(data.id, data.x, data.y, data.team);}});

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