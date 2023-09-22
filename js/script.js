function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    $slot = $(ev.target).closest('.ws-slot');
    console.log($slot);
    if ($slot) {
        console.log('yes');
        $slot.replaceWith($(document.getElementById(data)));
    }
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

$(document).ready( () => {
    $.getJSON("../js/workshops.json", data => {
        for (const ws of data.workshops) {
            $('.ws-itemrow').append(`
            <div class="w3-col l2 m4 s4 ws-item" draggable="true" ondragstart="drag(event)" id="${data.workshops.indexOf(ws)}">
                <button class="fa fa-close" onclick="resetWs(event)"></button>
                <h4>${ws.name}</h4>
                <div class="ws-description"><p>${ws.description}</p></div>
                <button style="display:inline;">Info</button>
                <p class="ws-location">Loc: ${ws.location}</p>
            </div>
            `);
        }
    })
})