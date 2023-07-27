// Enumerate your locations
const LOCATIONS = {
    HOME: 'home',
    //...
};

// Initiate the state
let state = {
    day: 1,
    hour: 0,
    energy: 100,
    eventSequence: [],
    currentActivityIndex: -1,
    location: LOCATIONS.HOME,
    inventory: []
};

// Class
class Item {
    constructor(name, power = 0, repeatable = true) {
        this.name = name;
        this.power = power;
        this.repeatable = repeatable;
    }
}

// Define your events
const EVENTS = [
    { name: 'Find Wooden Sword', item: new Item('Wooden Sword', 10, false), rarity: 10, locations: [LOCATIONS.HOME], energy: 5 },
    { name: 'Find Low Grade Pill', item: new Item('Low Grade Pill', 20, true), rarity: 20, locations: [LOCATIONS.HOME], energy: 5 },
    //.. etc
];

function ranOutOfStamina(){
    alert('Ran out of stamina! Game over.');
    clearInterval(loop);
};

function addActivity(activity) {
    activity.duration = activity.duration || 1; 
    let newIndex = state.eventSequence.push(activity) - 1;
    let activityDiv = document.getElementById('sequenceContainer');
    let newActivityEl = createActivityElement(newIndex, activity);
    activityDiv.appendChild(newActivityEl);
}

function removeActivity(index) {
    document.getElementById('sequenceContainer').removeChild(document.getElementById('activity' + index));
    state.eventSequence.splice(index, 1);
}

function manageTime(index, operator) {
    if (operator === '+') {
        state.eventSequence[index].duration++;
    } else if (operator === '-') {
        state.eventSequence[index].duration--;
        if (state.eventSequence[index].duration < 0) {
            state.eventSequence[index].duration = 0;
        }
    }
    document.getElementById('activityDuration' + index).innerText = state.eventSequence[index].duration;
}

function createActivityElement(index, activity) {
    let activityEl = document.createElement('div');
    activityEl.id = "activity" + index;
    activityEl.className = "activity";
    
    let markerEl = document.createElement('div');
    markerEl.id = "marker" + index;
    markerEl.className = "marker";
    markerEl.style.backgroundColor = 'transparent';

    activityEl.innerHTML = 
        activity.name + ' for ' + 
        '<span id="activityDuration' + index + '">' + activity.duration + '</span>' + ' hours '+
        '<button onclick="manageTime(' + index + ', \'-\')"> - </button>' +
        '<button onclick="manageTime(' + index + ', \'+\')"> + </button>' +
        '<button onclick="removeActivity(' + index + ')"> X </button>';

    activityEl.prepend(markerEl);
    return activityEl;
}

// Add manageEnergy returning true or false based on outcome (energy not fallen below 0)
function manageEnergy(activity){
    let spentEnergy = activity.energy || 10; 
    if(state.energy < spentEnergy){
        ranOutOfStamina();
        return false;
    }
    if(activity.name === 'rest'){
        state.energy += 10; 
    } else {
        state.energy -= spentEnergy; 
    }
    document.getElementById('energyCount').innerText = state.energy;
    return true;
}

function lookAround() {
    let possibleEvents = EVENTS.filter(event => event.locations.includes(state.location) && (!state.inventory.find(item => item.name === event.item.name) || event.item.repeatable));
    possibleEvents.sort((a, b) => a.rarity - b.rarity);
    let eventFound = null;
    for(let event of possibleEvents){
        if(Math.random() * 100 < event.rarity){
            eventFound = event;
            state.inventory.push(event.item);
            break;
        }
    }
    return eventFound;
}

function changeLocation(newLocation) {
    state.location = newLocation;
    document.getElementById('location').innerText = state.location;
}

function displayInventory() {
    const inventoryContainer = document.getElementById('inventory');
    inventoryContainer.innerHTML = state.inventory.map(item => item.name).join(', ');
}

function incrementHour() {
    if(state.hour == 24) {
        state.hour = 0;
    } else {
        state.hour++;
    }
    document.getElementById('hourCount').innerText = state.hour;
}

window.addEventListener('DOMContentLoaded', function(){
    displayInventory();

    const eventListContainer = document.getElementById('eventList');

    let restEventButton = document.createElement('button');
    restEventButton.innerText = 'Rest';
    restEventButton.addEventListener('click', function(){
        addActivity({name: 'Rest', duration: 1, energy: -10});
    });
    eventListContainer.appendChild(restEventButton);

    let lookAroundEventButton = document.createElement('button');
    lookAroundEventButton.innerText = 'Look Around';
    lookAroundEventButton.addEventListener('click', function(){
        let event = lookAround();
        if(event) {
            addActivity(event);
        } else {
            addActivity({name: 'Look Around', duration: 1, energy: 10});
        }
    });
    eventListContainer.appendChild(lookAroundEventButton);
});

function gameLoop() {
    incrementHour();
    if(!manageEnergy(state.eventSequence[state.currentActivityIndex])) {
        ranOutOfStamina();
        return;
    }
 
    if(state.eventSequence[state.currentActivityIndex].duration === 0){
        state.currentActivityIndex++;
        if(state.currentActivityIndex >= state.eventSequence.length){
            state.currentActivityIndex = 0;
        }
    }

    displayInventory();
    markCurrentActivity();

    state.eventSequence[state.currentActivityIndex].duration--;
}

let loop = setInterval(gameLoop, 1000);