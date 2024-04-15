// App variable to keep track of everything on the page
const app = {
    settings: {
        max_keuzes: -1,
        open_keuzes: -1,
    },
    workshops: {},
    slots: {},
}

// Helper variables to keep track of things
let currentDrag;

// Markup layouts using jquery-tmpl

// Expects SlotID, DisplayID
let slot_markup = '\
    <div class="w3-col l3 m4 s12 ws-slot" ondrop="drop(event)" ondragover="" id=slot_${SlotID}>\
        <h4 class="w3-center">Leeg</h4>\
    </div>\
';
// Expects workshop, workshop_naam, beschrijving, max_deelnemers, locatie
let workshop_markup = '\
    <div class="w3-col l3 m4 s12 ws-item" draggable="true" ondragstart="drag(event)" ondragend="dragEnd(event)" id="workshop_${workshop}">\
        <button class="fa fa-close" onclick="removeWithButton(this); event.stopPropagation();"></button>\
        <h4>${workshop_naam}</h4>\
        <div class="ws-description"><p>${beschrijving}</p></div>\
        \
        <div>\
        <div class="ws-more-info">\
            <p class="ws-max-name">0/${max_deelnemers}</p>\
            <p class="ws-loc-name">Locatie: ${locatie}</p>\
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


// Functions to be called everytime the slots/workshops need to refresh
function updateAll() {
    updateSlots();
}

function updateSlots() {
    $('#intekenRooster').empty()                                                    // Clear the entire div
    for (const workshop in app.slots) {
        const ws = app.slots[workshop];                                             // workshop is the ID, ws is the object
        // Draw either a slot or a workshop and append to rooster
        if (ws == 'empty') $.tmpl('slotTemplate', {SlotID: workshop}).appendTo('#intekenRooster');
        else $.tmpl('wsTemplate', ws).appendTo('#intekenRooster');
    }
}


// Run when the page layout is loaded
$(document).ready( ()=> {
    // Render templates
    $.template('slotTemplate', slot_markup);
    $.template('wsTemplate', workshop_markup);
    // Load slots and workshops using templates
    initiate()
});