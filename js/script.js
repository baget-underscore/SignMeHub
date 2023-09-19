function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    $(ev.target).closest('.ws-slot')
        .replaceWith($(document.getElementById(data)));
}

function resetWs(ev) {
    const ws = $(ev.target.parentElement);
    $(ev.target.parentElement).replaceWith(
        `<div class="w3-col l2 m4 s4 ws-slot" ondrop="drop(event)" ondragover="allowDrop(event)">
        <h4 class="w3-center">Sleep workshop hier</h4>
        </div>`
    );
    ws.appendTo('.ws-itemrow');
}