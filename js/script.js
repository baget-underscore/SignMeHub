let app = {
    workshops: {},
    currentDrag: -1,
    choices: {},
};

const itemSlotHTML = `
<div class="w3-col l3 m4 s12 ws-slot" ondrop="drop(event)" ondragover="allowDrop(event)">
    <h4 class="w3-center">Sleep workshop hier</h4>
</div>
`;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    app.currentDrag = ev.target.id;

    if (typeof app.currentDrag !== 'string' || !app.currentDrag.startsWith('ws_')) {
        app.currentDrag = -1;
    }
}

function drop(ev) {
    ev.preventDefault();
    if (app.currentDrag !== -1) {
        $draggedItem = $(`#${app.currentDrag}`);
        $dragarea = $draggedItem.closest('#intekenRooster');
        $slot = $(ev.target).closest('.ws-slot');
        let dragIndex = $draggedItem.index() + 1;
        let targetIndex = $slot.attr('id');
        
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
        let draggedItemInDragarea = $draggedItem.closest('#intekenOpties').length == 1;
        if ($dragarea.length == 1 && !draggedItemInDragarea) {
            resetWs($draggedItem);
        }
        app.currentDrag = -1;
    }
}
    
function resetWs(target) {
    const $ws = $(target);
    let dragIndex = $ws.index() + 1;
    delete app.choices[dragIndex];
    $ws.replaceWith($(itemSlotHTML).attr('id', dragIndex));
    $ws.appendTo('#intekenOpties');
}

$(document).ready( () => {
    $.getJSON("../js/workshops.json", data => {
        app.workshops = data.workshops;
        $.each(app.workshops, function(key, value) {
            $('#intekenOpties').append(`
            <div class="w3-col l3 m4 s12 ws-item" draggable="true" ondragstart="drag(event)" id="ws_${key}">
                <div class="w3-dropdown-hover w3-right">
                    <button class="fa fa-plus"></button>
                    <div class="w3-dropdown-content w3-bar-block" style="right:0">
                        <button>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                        <button>5</button>
                        <button>6</button>
                    </div>
                </div>
                <button class="fa fa-close" onclick="resetWs(event.target.parentElement)"></button>
                <h4>${value.name}</h4>
                <div class="ws-description"><p>${value.description}</p></div>
                
                <button>Info</button>
                <div class="ws-location w3-rest">
                    <p>
                    Locatie:
                    <span class="ws-loc-name">${value.location}</span>
                    </p>
                </div>
            </div>
            `);
        });
    });
})

