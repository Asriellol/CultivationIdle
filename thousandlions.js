var state = {
    day: 1,
    hour: 0,
    energy: 100,
    eventSequence: [],
    currentActivityIndex: -1 // This will represent which activity we're performing in the sequence
};

function ranOutOfStamina(){
    alert('Ran out of stamina! Game over.');
    clearInterval(loop);
}

function incrementDay(){
    if(state.currentActivityIndex == state.eventSequence.length){
        state.hour = 0; 
        state.currentActivityIndex = 0;
        state.day++;
        document.getElementById('dayCount').innerText = state.day;
    }
}

function incrementHour(){
    if(state.hour == 24){
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
    state.eventSequence.push(activity);
}

function manageTime(operator){
    if(operator === "+"){
        state.eventSequence[state.currentActivityIndex].duration++;
    } else if(operator === "-"){
        state.eventSequence[state.currentActivityIndex].duration--;
    }
}

function getAndUpdateCurrentActivity(){
    if(state.energy <= 0){
        ranOutOfStamina();
    }

    if(state.eventSequence[state.currentActivityIndex].duration === 0){
        state.currentActivityIndex++;
        incrementDay();
        document.getElementById('currentEvent').innerText = state.eventSequence[state.currentActivityIndex].name;
    }

    manageEnergy(state.eventSequence[state.currentActivityIndex]);
    state.eventSequence[state.currentActivityIndex].duration--;
 }

function gameLoop(){
    incrementHour();
    getAndUpdateCurrentActivity();
}

addActivity({
    name: 'rest',
    duration: 6
});

addActivity({
    name: 'cultivate',
    duration: 10
});

var loop = setInterval(gameLoop, 1000);