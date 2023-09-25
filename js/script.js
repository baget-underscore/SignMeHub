let app = {
    workshops: {},
    currentDrag: -1,
};

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    app.currentDrag = ev.target.id;
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    $slot = $(ev.target).closest('.ws-slot');
    if ($slot.length > 0) {
        $slot.replaceWith($(document.getElementById(data)));
        app.currentDrag = -1;
    }
    $dragarea = $(ev.target).closest('.ws-dragarea');
    if ($dragarea.length == 1) {
        resetWs($(document.getElementById('ws_'+app.currentDrag)));
    }
}

function resetWs(target) {
    const $ws = $(target);
    $ws.replaceWith(
        `<div class="w3-col l2 m4 s4 ws-slot" ondrop="drop(event)" ondragover="allowDrop(event)">
            <h4 class="w3-center">Sleep workshop hier</h4>
        </div>`
    );
    $ws.appendTo('.ws-dragarea');
}

$(document).ready( () => {
    $.getJSON("../js/workshops.json", data => {
        app.workshops = data.workshops;
        $.each(app.workshops, function(key, value) {
            $('.ws-itemrow').append(`
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

