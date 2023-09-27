let app = {
    workshops: {},
    currentDrag: -1,
    choices: {},
};

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    console.log(ev);
    ev.dataTransfer.setData("text", ev.target.id);
    app.currentDrag = ev.target.id;
}

function drop(ev) {
    ev.preventDefault();
    $draggedItem = $(`#${app.currentDrag}`);
    
    $slot = $(ev.target).closest('.ws-slot');
    let draggedItemInSlot = $draggedItem.closest('.ws-slot').length == 1;
    if ($slot.length > 0 && !draggedItemInSlot) {
        $slot.replaceWith($draggedItem);
        app.choices[$slot.attr('id')] = app.currentDrag;
        console.log(app.choices)
        app.currentDrag = -1;
    }
    $dragarea = $(ev.target).closest('#intekenOpties');
    let draggedItemInDragarea = $draggedItem.closest('#intekenOpties').length == 1;
    if ($dragarea.length == 1 && !draggedItemInDragarea) {
        resetWs($draggedItem);
        app.currentDrag = -1;
    }
}

function resetWs(target) {
    const $ws = $(target);
    $ws.replaceWith(
        `<div class="w3-col l2 m4 s4 ws-slot" ondrop="drop(event)" ondragover="allowDrop(event)">
            <h4 class="w3-center">Sleep workshop hier</h4>
        </div>`
    );
    $ws.appendTo('#intekenOpties');
}

$(document).ready( () => {
    $.getJSON("../js/workshops.json", data => {
        app.workshops = data.workshops;
        $.each(app.workshops, function(key, value) {
            $('#intekenOpties').append(`
            <div class="w3-col l2 m4 s4 ws-item" draggable="true" ondragstart="drag(event)" id="ws_${key}">
                <button class="fa fa-close" onclick="resetWs(event.target.parentElement)"></button>
                <h4>${value.name}</h4>
                <div class="ws-description"><p>${value.description}</p></div>
                <button style="display:inline;">Info</button>
                <p class="ws-location">Loc: ${value.location}</p>
            </div>
            `);
        });
    });
})

