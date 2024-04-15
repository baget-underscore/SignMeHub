// App variable to keep track of everything on the page
const app = {
    settings: {
        max_keuzes: -1,
        open_keuzes: -1,
    },
    workshops: {},
    slots: {
        counts: {

        }
    },
}

// Helper variables to keep track of things
let currentDrag;

// Markup layouts using jquery-tmpl

// Expects SlotID, DisplayID
let slot_markup = '\
    <div class="w3-col l3 m4 s12 ws-slot" ondrop="drop(event)" ondragover="" id=slot_${SlotID}>\
        <h4 class="w3-center">${DisplayID}</h4>\
    </div>\
';
// Expects workshop, force, workshop_naam, beschrijving, max_deelnemers, locatie
let workshop_markup = '\
    <div class="w3-col l3 m4 s12 ws-item" draggable="true" ondragstart="drag(event)" ondragend="dragEnd(event)" id="workshop_${workshop}">\
        <button class="fa fa-close ${force}" onclick="removeWithButton(this); event.stopPropagation();"></button>\
        <h4>${workshop_naam}</h4>\
        <div class="ws-description"><p>${beschrijving}</p></div>\
        \
        <div>\
        <div class="ws-more-info">\
            <p class="ws-loc-name">Locatie: ${locatie}</p>\
            <p class="ws-max-name">{{if deelnemers}}${deelnemers}{{else}}0{{/if}}/${max_deelnemers}</p>\
        </div>\
        </div>\
    </div>\
';


/* Useful functions for data getting and setting */

// Gets key in an object from value in same object
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// Run a query with PHP, return the result.
function query(query, callbackFn) {
    const data = $.ajax({
        type: 'POST',
        url: '../../php/query.php',
        data: { q: query },
        dataType: 'json',
        cache: false,
        success: callbackFn,
        error: (data)=> console.error(data.responseText),
    });
    return data;
}


/* The functions below are all attached to every workshop on the page. */

// Allows a workshop to be dropped
function allowDrop(ev) {
    ev.preventDefault();
}

// Allows a workshop to be dragged, preventing anything that is not a workshop to be dropped. Highlight available slots
function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
    currentDrag = ev.target.id;

    if (typeof currentDrag !== 'string' || !currentDrag.startsWith('workshop_')) {
        currentDrag = -1;
    }
    else {
        currentDrag = Number(currentDrag.replace('workshop_', ''));
        highlightOptions();
    }
}

// If a drag ends, unhighlight everything
function dragEnd(ev) {
    unHighlightAll();
}


// Make all available slots green and drop-able
function highlightOptions() {
    const wsOptions = app.workshops[currentDrag].opties;
    for (const child of $('#intekenRooster').children()) {
        const child_id = Number(child.id.replace('slot_', ''));
        if (child_id in wsOptions) {
            if (app.slots.counts[child_id] == app.workshops[currentDrag].max_deelnemers) {
                $(child).css('background-color', 'lightpink');
            }
            else {
                $(child).css('background-color', 'lightgreen');
                $(child).attr('ondragover', 'allowDrop(event)');
            }
        }
    }
}

// Revert all slots back to gray and not-drop-able
function unHighlightAll() {
    for (const child of $('#intekenRooster').children()) {
        $(child).css('background-color', 'lightgray');
        $(child).attr('ondragover', '');
    }
}


// Drop function is called when user lets go of the mouse button while something is being dragged
function drop(ev) {
    ev.preventDefault(); // Allow drop
    const draggedItemID = currentDrag; // ID of the workshop being dragged
    if (draggedItemID == -1 || app.workshops[draggedItemID].force == true) return; // If the currently dragged item is not a workshop, or it's forced into the roster, don't do anything
    const draggedItem = $('#workshop_' + draggedItemID); // jQuery object of the workshop
    const dropTarget = $(ev.target); // jQuery target, where the workshop was dropped

    if (dropTarget.closest('#intekenRooster').length != 0) {
        // If the target is rooster, move to workshop to the correct slot
        addToChoices(app.workshops[draggedItemID], dropTarget.closest('.ws-slot').attr('id').replace('slot_', ''));
    }
    else if (dropTarget.closest('#intekenOpties').length != 0) {
        // If the workshop is already in the bottom area, don't do anything
        if (draggedItem.closest('#intekenOpties').length != 0) return;
        // If the workshop was in intekenRooster, remove it
        removeFromChoices(app.workshops[draggedItemID], getKeyByValue(app.slots, app.workshops[draggedItemID]));
    }
}


/*
Functions related to jQuery ajax
Ajax callback functions expect database query result in json format.
PHP query functions return array with result
tmpl "draws" slots & workshops to screen
*/


// Functions to load all the slots & workshops. Calling next function on completion is kindof wacky but it works
function initiate() {
    query('SELECT * FROM workshop', initWorkshops);
}

function initWorkshops(data) {
    // For each workshop, add its data to app.workshops with its ID as the key
    data.forEach(workshop => {
        workshop.opties = {}; // preparation for initAllWorkshopOptions
        app.workshops[workshop.workshop] = workshop;
        app.workshops[workshop.workshop].force = false;
    });
    query('\
        SELECT w.workshop, wo.wo_id, wo.optie_id FROM workshop w\
        LEFT JOIN workshop_optie wo ON w.workshop = wo.workshop\
        ORDER BY wo.optie_id\
    ', initAllWorkshopOptions);
    
}

function initAllWorkshopOptions(data) {
    // For each workshop, add its possible options (timeslots) to the workshop object
    data.forEach(workshop => {
        if (app.workshops[workshop.workshop]) app.workshops[workshop.workshop].opties[workshop.optie_id] = workshop.wo_id;
    });
    query('\
        SELECT workshop FROM workshop_organisator\
        WHERE user_id = ?\
    ', initWorkshopsGiven);
}

function initWorkshopsGiven(data) {
    // For each workshop, if you are the organizer, force it into the roster.
    data.forEach(workshop_organized => {
        for (optie in app.workshops[workshop_organized.workshop].opties) {
            app.workshops[workshop_organized.workshop].force = true;
            app.slots[optie] = app.workshops[workshop_organized.workshop];
        }
    });
    query('SELECT * FROM settings', initSettings);
}

function initSettings(data) {
    // Set app settings
    app.settings = data[0];
    query('\
        SELECT wo.optie_id, wo.workshop FROM workshop_keuze wk\
        LEFT JOIN workshop_optie wo ON wk.wo_id = wo.wo_id\
        WHERE wk.user_id = ?\
    ', initSlots);
    
}

function initSlots(data) {
    // First, set every slot to empty
    for (i = 0; i < app.settings.max_keuzes; i++) {
        if (app.slots[i]) continue;
        app.slots[i] = 'empty';
    }
    // Now set all workshops that the user has chosen
    data.forEach(ws_choice => app.slots[ws_choice.optie_id] = app.workshops[ws_choice.workshop]);
    updateAll();
}


// Functions to add/remove workshops from user choices, updates database
function addWithMenu(workshop) {
    addToChoices(ws, slot);
}

function removeWithButton(workshop) {
    // Get closest workshop to button, find in app.workshops. Then reset slot
    const ws = app.workshops[$(workshop).closest('.ws-item').attr('id').replace('workshop_', '')];
    const slot = getKeyByValue(app.slots, ws);
    removeFromChoices(ws, slot);
}

function addToChoices(workshop, slot) {
    // If the workshop was already in rooster, remove workshop_keuze entry from app.slots and database
    if (getKeyByValue(app.slots, workshop)) {
        query(`DELETE FROM workshop_keuze WHERE user_id = ? AND wo_id = ${workshop.opties[getKeyByValue(app.slots, workshop)]}`, null);
        app.slots[getKeyByValue(app.slots, workshop)] = 'empty';
    }
    // Add the workshop to app.slots and database workshop_keuze
    app.slots[slot] = workshop;
    query(`INSERT INTO workshop_keuze (user_id, wo_id, presentie_status) VALUES (?, ${workshop.opties[slot]}, 0)`, updateAll);
}

function removeFromChoices(workshop, slot) {
    // Remove workshop_keuze entry from app.slots and database
    app.slots[slot] = 'empty';
    query(`DELETE FROM workshop_keuze WHERE user_id = ? AND wo_id = ${workshop.opties[slot]}`, updateAll)
}


// Functions to be called everytime the slots/workshops need to refresh
function updateAll() {
    query('\
        SELECT wo.workshop, wo.optie_id, COUNT(wk.wo_id) as "COUNT" FROM workshop_keuze wk\
        LEFT JOIN workshop_optie wo ON wk.wo_id = wo.wo_id\
        GROUP BY wo.wo_id\
    ', updateChoiceCount);
}

function updateChoiceCount(data) {
    data.forEach(choice => {
        if (app.slots[choice.optie_id] && app.slots[choice.optie_id] != 'empty') app.slots.counts[choice.optie_id] = choice.COUNT;
    });
    updateSlots();
    updateWorkshops();
}

function updateSlots() {
    $('#intekenRooster').empty()                                                    // Clear the entire div
    for (const slot_id in app.slots) {
        if (slot_id == 'counts') continue;
        // Draw either a slot or a workshop and append to rooster
        if (app.slots[slot_id] == 'empty') $.tmpl('slotTemplate', {SlotID: Number(slot_id), DisplayID: Number(slot_id) + 1}).appendTo('#intekenRooster');
        else {
            const ws = Object.create(app.slots[slot_id]);
            ws.deelnemers = app.slots.counts[slot_id];
            $.tmpl('wsTemplate', ws).appendTo('#intekenRooster');
        }
    }
}

function updateWorkshops() {
    $('#intekenOpties').empty()                                                     // Clear the entire div
    const workshopsToNotDraw = [];
    for (const slot_id in app.slots) {
        if (slot_id == 'counts') continue;
        const slot = app.slots[slot_id];
        if (slot != 'empty') {
            workshopsToNotDraw.push(slot.workshop.toString());                      // Array of already chosen workshops
        } 
    }
    for (const workshop in app.workshops) {
        const ws = app.workshops[workshop];
        if (workshopsToNotDraw.includes(ws.workshop.toString())) continue;          // Ignore chosen workshops
        else $.tmpl('wsTemplate', ws).appendTo('#intekenOpties');
    }
}


// Run when the page layout is loaded
$(document).ready( ()=> {
    // Render templates
    $.template('slotTemplate', slot_markup);
    $.template('wsTemplate', workshop_markup);
    // Load slots and workshops using templates
    initiate();
});