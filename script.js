// =========================
// LifeTracker v1
// =========================

let goals = JSON.parse(localStorage.getItem("lifetracker-goals")) || [];

const goalList = document.getElementById("goalList");

const modal = document.getElementById("modal");

const addButton = document.getElementById("addButton");
const cancelButton = document.getElementById("cancelButton");
const saveButton = document.getElementById("saveButton");

const themeButton = document.getElementById("themeButton");

const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

const goalName = document.getElementById("goalName");
const goalEmoji = document.getElementById("goalEmoji");
const goalTarget = document.getElementById("goalTarget");
const goalUnit = document.getElementById("goalUnit");
const goalCategory = document.getElementById("goalCategory");
const goalColor = document.getElementById("goalColor");

const generalPercent = document.getElementById("generalPercent");
const completedCount = document.getElementById("completedCount");
const goalCount = document.getElementById("goalCount");

const progressCircle = document.getElementById("progressCircle");

const fecha = document.getElementById("fecha");

const CIRCLE_LENGTH = 440;

//============================

function saveData(){

    localStorage.setItem(
        "lifetracker-goals",
        JSON.stringify(goals)
    );

}

//============================

function updateDate(){

    const now = new Date();

    fecha.textContent =
        now.toLocaleDateString(
            "es-UY",
            {
                weekday:"long",
                day:"numeric",
                month:"long",
                year:"numeric"
            }
        );

}

//============================

function openModal(){

    modal.classList.remove("hidden");

}

function closeModal(){

    modal.classList.add("hidden");

}

//============================

addButton.onclick = openModal;

cancelButton.onclick = closeModal;

//============================

saveButton.onclick = ()=>{

    if(goalName.value.trim()=="") return;

    if(goalTarget.value<=0) return;

    goals.push({

        id:Date.now(),

        emoji:goalEmoji.value || "🎯",

        name:goalName.value,

        target:Number(goalTarget.value),

        progress:0,

        unit:goalUnit.value,

        category:goalCategory.value,

        color:goalColor.value

    });

    goalName.value="";
    goalEmoji.value="";
    goalTarget.value="";
    goalColor.value="#4CAF50";

    closeModal();

    saveData();

    render();

};

//============================

function removeGoal(id){

    goals = goals.filter(g=>g.id!=id);

    saveData();

    render();

}

//============================

function addProgress(id){

    const goal = goals.find(g=>g.id==id);

    if(!goal) return;

    goal.progress++;

    if(goal.progress>goal.target)
        goal.progress=goal.target;

    saveData();

    render();

}

//============================

function subtractProgress(id){

    const goal = goals.find(g=>g.id==id);

    if(!goal) return;

    goal.progress--;

    if(goal.progress<0)
        goal.progress=0;

    saveData();

    render();

}

//============================

function updateDashboard(){

    goalCount.textContent = goals.length;

    let completed =
        goals.filter(g=>g.progress>=g.target).length;

    completedCount.textContent = completed;

    let percent = 0;

    if(goals.length>0){

        goals.forEach(g=>{

            percent += (g.progress/g.target);

        });

        percent /= goals.length;

    }

    percent*=100;

    generalPercent.textContent =
        Math.round(percent)+"%";

    const offset =
        CIRCLE_LENGTH -
        (percent/100)*CIRCLE_LENGTH;

    progressCircle.style.strokeDashoffset =
        offset;

}

//============================

function render(){

    goalList.innerHTML="";

    let search =
        searchInput.value.toLowerCase();

    goals.forEach(goal=>{

        let completed =
            goal.progress>=goal.target;

        if(
            !goal.name
            .toLowerCase()
            .includes(search)
        ) return;

        if(
            filterSelect.value=="completed"
            && !completed
        ) return;

        if(
            filterSelect.value=="pending"
            && completed
        ) return;

        const percent =
            (goal.progress/goal.target)*100;

        goalList.innerHTML += `

<div class="goal">

<div class="goalTop">

<div class="goalTitle">

<div class="emoji">

${goal.emoji}

</div>

<div>

<h2>${goal.name}</h2>

<p>${goal.category}</p>

</div>

</div>

</div>

<div class="bar">

<div
class="fill"
style="
width:${percent}%;
background:${goal.color};
">

</div>

</div>

<div class="goalFooter">

<div>

<b>

${goal.progress}

</b>

/

${goal.target}

${goal.unit}

</div>

<div class="goalButtons">

<button onclick="subtractProgress(${goal.id})">

−

</button>

<button onclick="addProgress(${goal.id})">

+

</button>

<button onclick="removeGoal(${goal.id})">

🗑

</button>

</div>

</div>

</div>

`;

    });

    updateDashboard();

}

//============================

themeButton.onclick=()=>{

    document.body.classList.toggle("light");

}

//============================

searchInput.oninput=render;

filterSelect.onchange=render;

//============================

updateDate();

render();
