let app = {
    settings: {
        maxSlots: -1,
    },
    workshops: {},
    choices: {},
    currentDrag: -1,
    slotID: -1,
};

function checkAvailable() {
    if (Object.keys(app.choices).length >= app.settings.maxSlots) {
        $('.fa.fa-plus').prop('disabled', true);
    }
    else {
        $('.fa.fa-plus').prop('disabled', false);
    }
    Object.keys(app.choices).forEach((wsKey) => {
        console.log(wsKey.slice(2));
        console.log($(`#${wsKey.slice(2)}`));
        $(`#${wsKey.slice(2)}`).prop('disabled', true);
    })
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

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
        
        let itemSlotHTML = `
        <div class="w3-col l3 m4 s12 ws-slot" ondrop="drop(event)" ondragover="allowDrop(event)" id=s_${app.slotID}>
        <h4 class="w3-center">${app.slotID}</h4>
        </div>
        `;
        
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
        checkAvailable();
        app.currentDrag = -1;
    }
}

function resetWs(target) {
    const $ws = $(target);
    app.slotID = getKeyByValue(app.choices, $ws.attr('id')).slice(2);
    console.log(app.slotID);
    let dragIndex = `s_${$ws.index() + 1}`;
    let itemSlotHTML = `
    <div class="w3-col l3 m4 s12 ws-slot" ondrop="drop(event)" ondragover="allowDrop(event)" id=s_${app.slotID}>
    <h4 class="w3-center">${app.slotID}</h4>
    </div>
    `;
    delete app.choices[dragIndex];
    $ws.replaceWith($(itemSlotHTML).attr('id', dragIndex));
    $ws.appendTo('#intekenOpties');
    checkAvailable();
    app.slotID = -1;
}

function showInfo(target) {
    $('#modal_ws_info h2').text($(target).find('h4').text());
    $('#modal_ws_info div p').text($(target).find('div p:first').text());
    $('#modal_ws_info footer p').text('Locatie: ' +  $(target).find('div span').text());
    $('#modal_ws_info').show();
    // get all info from the database / ws description
}

function chooseWorkshop(button) {
    let $buttonItem = $(button).closest(".dd-menu").find(".dd-content:first");
    $buttonItem.css('display', 'none');
    let $sourceItem = $(button).closest('.ws-item');
    let $targetSlot = $(`#s_${button.id}`);
    let success = $targetSlot.replaceWith($sourceItem);
    if (success.length > 0) {
        app.choices[`s_${button.id}`] = $sourceItem.attr('id');
    }
    checkAvailable();
}

function dropdown(button) {
    if (!(Object.keys(app.choices).length >= app.settings.maxSlots)) {
        let $buttonItem = $(button).closest(".dd-menu").find(".dd-content:first");
        $buttonItem.css('display', 'block');
        // $buttonItem.children().attr('disabled', true);
    }
}

window.onclick = function(event) {
    if (event.target.id == 'modal_ws_info') {
        $(`#modal_ws_info`).hide();
    }
}

$(document).ready( () => {
    $.getJSON("../js/workshops.json", data => {
        app.settings = data.settings;
        app.workshops = data.workshops;
        let slotButtons = ``;
        let slots = ``;
        for (let i = 0; i < app.settings.maxSlots; i++) {
            slots += `<div class="w3-col l3 m4 s12 ws-slot" ondrop="drop(event)" ondragover="allowDrop(event)" id="s_${i+1}">
            <h4 class="w3-center">${i+1}</h4></div>`
            slotButtons += `<button onclick="chooseWorkshop(this); event.stopPropagation();" id="${i+1}">${i+1}</button>`;
            if (i % 3 == 2) {
                slotButtons += `<br>`;
            }
        }
        console.log($('#intekenRooster'))
        $('#intekenRooster').append(slots);
        $.each(app.workshops, function(key, value) {
            $('#intekenOpties').append(`
            <div class="w3-col l3 m4 s12 ws-item" draggable="true" ondragstart="drag(event)" onclick="showInfo(this)" id="ws_${key}">
                <div class="dd-menu">
                    <button class="fa fa-plus" onclick="dropdown(this); event.stopPropagation();"></button>
                    <button class="fa fa-close" onclick="resetWs(event.target.parentElement.parentElement); event.stopPropagation();"></button>
                    <div class="dd-content w3-right">
                        ${slotButtons}
                    </div>
                </div>
                <h4>${value.name}</h4>
                <div class="ws-description"><p>${value.description}</p></div>
                
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

