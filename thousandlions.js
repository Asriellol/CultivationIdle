let state = {
    day: 1,
    hour: 0,
    energy: 100,
    eventSequence: [],
    currentActivityIndex: -1
};

let activityIndex = 0;

function ranOutOfStamina(){
    alert('Ran out of stamina! Game over.');
    clearInterval(loop);
};

function incrementDay() {
    incrementActivity();
    if(state.currentActivityIndex == state.eventSequence.length){
        state.hour = 0; 
        state.currentActivityIndex = 0;
        state.day++;
        document.getElementById('dayCount').innerText = state.day;
    }
}

function incrementHour() {
    if(state.hour == 24) {
        state.hour = 0;
    } else {
        state.hour++;
    }
    document.getElementById('hourCount').innerText = state.hour;
}


function manageEnergy(activity){
    if(activity.name === 'rest'){
        state.energy += 10; 
    } else {
        state.energy -= 10; 
    }
    document.getElementById('energyCount').innerText = state.energy;
}


function addActivity(activity){
    let newActivityIndex = state.eventSequence.push(activity) - 1;
    let newActivityEl = createActivityElement(newActivityIndex, activity);
    document.getElementById('sequenceContainer').appendChild(newActivityEl);
}

function removeActivity(activityIndex){
    state.eventSequence.splice(activityIndex, 1);
    document.getElementById("sequenceContainer").removeChild(document.getElementById("activity"+activityIndex));
}


function createActivityElement(index, activity) {
    let activityEl = document.createElement('div');
    activityEl.id = "activity"+index;
    activityEl.innerHTML =
        activity.name + ' for ' +
        '<span id="activityDuration'+index+'">'+activity.duration+'</span>' + ' hours ' +
        '<button onclick="manageTime('+index+', \'-\')"> - </button>' +
        '<button onclick="manageTime('+index+', \'+\')"> + </button>' +
        '<button onclick="removeActivity('+index+')"> X </button>';
    return activityEl;
}


function updateActivityDuration(activityIndex, newDuration) {
    document.getElementById('activityDuration'+activityIndex).innerText = newDuration;
}

function manageTime(activityIndex, operator){
    if(operator === "+") {
        state.eventSequence[activityIndex].duration++;
    } else if(operator === "-") {
        state.eventSequence[activityIndex].duration--;
    }
    updateActivityDuration(activityIndex, state.eventSequence[activityIndex].duration);
}

function getAndUpdateCurrentActivity() {
    if(state.energy <= 0){
        ranOutOfStamina();
    }

    if(state.eventSequence[state.currentActivityIndex].duration === 0) {
        incrementDay();
        document.getElementById('currentEvent').innerText = state.eventSequence[state.currentActivityIndex].name;
    }

    manageEnergy(state.eventSequence[state.currentActivityIndex]);
    state.eventSequence[state.currentActivityIndex].duration--;
}

function gameLoop() {
    incrementHour();
    getAndUpdateCurrentActivity();
}

let isClickedOnce = false;
let currentEvent = '';

window.addEvent = function(event) {
 let eventListItem = document.createElement('li');
 let eventButton = document.createElement('button');
 eventButton.innerHTML = event.name;

 eventButton.addEventListener('click', function(){
     if(currentEvent !== event.name){
         isClickedOnce = false;
         document.getElementById('eventDescContainer').innerText = event.description;
         currentEvent = event.name;
     } else{
        if(!isClickedOnce){
         isClickedOnce = true;
         }
         else{
         addActivity({name: event.name, duration: 1});
         isClickedOnce = false;
        }
      
     }
 });
    
 eventListItem.appendChild(eventButton);
 document.getElementById('eventList').appendChild(eventListItem); 
}

window.addEventListener('load', function(){
    addEvent({name: 'rest', description: 'Rest and regain energy'});
    addEvent({name: 'look around', description: 'Explore the surroundings'});
});

let loop = setInterval(function() {
    gameLoop();
    activityIndex = state.currentActivityIndex;
}, 1000);