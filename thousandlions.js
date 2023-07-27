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

function addActivity(activity) {
    activity.duration = activity.duration || 1; 
    let newActivityIndex = state.eventSequence.push(activity) - 1;
    let newActivityEl = createActivityElement(newActivityIndex, activity);
    document.getElementById('sequenceContainer').appendChild(newActivityEl);
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
    activityEl.id = "activity"+index;
    activityEl.className = "activity";
    
    let markerEl = document.createElement('div');
    markerEl.id = "marker"+index;   // Re-add this line
    markerEl.className = "marker";
    markerEl.style.backgroundColor = 'transparent';

    activityEl.innerHTML = 
        activity.name + ' for ' + 
        '<span id="activityDuration'+index+'">'+activity.duration+'</span>' + ' hours '+
        '<button onclick="manageTime('+index+', \'-\')"> - </button>'+
        '<button onclick="manageTime('+index+', \'+\')"> + </button>'+
        '<button onclick="removeActivity('+index+')"> X </button>';

    activityEl.prepend(markerEl);
    return activityEl;
};

function markCurrentActivity() {
    // Remove the marker from the previous activity
    if(state.currentActivityIndex > 0) {
        document.getElementById('marker'+(state.currentActivityIndex-1)).style.backgroundColor = "red";
    }

    // Mark the current activity
    document.getElementById('marker'+state.currentActivityIndex).style.backgroundColor = "green";
}

function getAndUpdateCurrentActivity() {
    if(state.energy <= 0){
        ranOutOfStamina();
    }
    
    if(state.eventSequence[state.currentActivityIndex].duration === 0) {
        incrementDay();
        document.getElementById('currentEvent').innerText = state.eventSequence[state.currentActivityIndex].name;
        markCurrentActivity();
    }

    manageEnergy(state.eventSequence[state.currentActivityIndex]);
    state.eventSequence[state.currentActivityIndex].duration--;
}

function gameLoop() {
    incrementHour();
    getAndUpdateCurrentActivity();
    markCurrentActivity();
}

window.addEventListener('DOMContentLoaded', function(){
    let restEventButton = document.createElement('button');
    restEventButton.innerText = 'Rest';
    restEventButton.addEventListener('click', function(){
        addActivity({name: 'rest', duration: 1});
    });
    document.getElementById('eventList').appendChild(restEventButton);

    let lookAroundEventButton = document.createElement('button');
    lookAroundEventButton.innerText = 'Look Around';
    lookAroundEventButton.addEventListener('click', function(){
        addActivity({name: 'look around', duration: 1});
    });
    document.getElementById('eventList').appendChild(lookAroundEventButton);
});

// Start the game
let loop = setInterval(function() {
    gameLoop();
    activityIndex = state.currentActivityIndex;
}, 1000);