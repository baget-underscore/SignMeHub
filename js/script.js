let app = {
    workshops: {},
    currentDrag: -1,
    choices: {},
};

const itemSlotHTML = `
<div class="w3-col l3 m4 s4 ws-slot" ondrop="drop(event)" ondragover="allowDrop(event)">
    <h4 class="w3-center">Sleep workshop hier</h4>
</div>
`;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    app.currentDrag = ev.target.id

    if (typeof app.currentDrag !== 'string' || !app.currentDrag.startsWith('ws_')) {
        app.currentDrag = -1;
    }
}

function drop(ev) {
    ev.preventDefault();
    if (app.currentDrag !== -1) {
        $draggedItem = $(`#${app.currentDrag}`);
        $slot = $(ev.target).closest('.ws-slot');
        let dragIndex = $draggedItem.index() + 1;
        let targetIndex = $slot.attr('id');
        
        $dragarea = $draggedItem.closest('#intekenRooster');
        let draggedItemInSlot = $draggedItem.closest('.ws-slot').length == 1;
        let draggedItemFromSlot = $dragarea.length == 1;
        if ($slot.length > 0 && !draggedItemInSlot) {
            if (draggedItemFromSlot) {
                $(itemSlotHTML).attr('id', dragIndex).insertAfter($draggedItem);
                delete app.choices[dragIndex];
            }
            $slot.replaceWith($draggedItem);
            app.choices[targetIndex] = app.currentDrag;
        }
        
        $dragarea = $(ev.target).closest('#intekenOpties');
        console.log(dragIndex);
        let draggedItemInDragarea = $draggedItem.closest('#intekenOpties').length == 1;
        if ($dragarea.length == 1 && !draggedItemInDragarea) {
            resetWs($draggedItem);
        }
        app.currentDrag = -1;
        console.log(app.choices);
    }
}
    
    function resetWs(target) {
        const $ws = $(target);
        let dragIndex = $ws.index() + 1;
        console.log(dragIndex);
        $ws.replaceWith($(itemSlotHTML).attr('id', dragIndex));
        $ws.appendTo('#intekenOpties');
}

$(document).ready( () => {
    $.getJSON("../js/workshops.json", data => {
        app.workshops = data.workshops;
        $.each(app.workshops, function(key, value) {
            $('#intekenOpties').append(`
            <div class="w3-col l3 m4 s2 ws-item" draggable="true" ondragstart="drag(event)" id="ws_${key}">
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

