// ==========================
// Momentum v1 - Parte 1
// ==========================

const STORAGE_KEY = "momentum-goals";

let goals = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

//---------------------------
// ELEMENTOS
//---------------------------

const goalsContainer = document.getElementById("goals");

const addGoalButton = document.getElementById("addGoalButton");

const goalModal = document.getElementById("goalModal");

const closeModal = document.getElementById("closeModal");

const cancelButton = document.getElementById("cancelButton");

const saveGoalButton = document.getElementById("saveGoal");

const search = document.getElementById("search");

const filter = document.getElementById("filter");

const emptyState = document.getElementById("emptyState");

const toast = document.getElementById("toast");

const todayDate = document.getElementById("todayDate");

const goalCounter = document.getElementById("goalCounter");

const completedCounter = document.getElementById("completedCounter");

const globalPercent = document.getElementById("globalPercent");

//---------------------------
// FECHA
//---------------------------

function loadDate(){

    const now = new Date();

    todayDate.textContent =
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

//---------------------------
// GUARDAR
//---------------------------

function save(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(goals)
    );

}

//---------------------------
// MODAL
//---------------------------

function openModal(){

    goalModal.classList.remove("hidden");

}

function hideModal(){

    goalModal.classList.add("hidden");

}

addGoalButton.onclick=openModal;

closeModal.onclick=hideModal;

cancelButton.onclick=hideModal;

//---------------------------
// TOAST
//---------------------------

function showToast(text){

    toast.textContent=text;

    toast.classList.remove("hidden");

    setTimeout(()=>{

        toast.classList.add("hidden");

    },2000);

}

//---------------------------
// CREAR OBJETIVO
//---------------------------

saveGoalButton.onclick=function(){

    const emoji =
        document.getElementById("goalEmoji").value || "🎯";

    const name =
        document.getElementById("goalName").value.trim();

    const target =
        Number(
            document.getElementById("goalTarget").value
        );

    const unit =
        document.getElementById("goalUnit").value;

    const category =
        document.getElementById("goalCategory").value;

    const color =
        document.getElementById("goalColor").value;

    if(name==""){

        alert("Ingresá un nombre.");

        return;

    }

    if(target<=0){

        alert("La meta debe ser mayor que 0.");

        return;

    }

    goals.push({

        id:Date.now(),

        emoji,

        name,

        target,

        progress:0,

        unit,

        category,

        color

    });

    save();

    render();

    hideModal();

    showToast("Objetivo creado.");

    document.getElementById("goalEmoji").value="";

    document.getElementById("goalName").value="";

    document.getElementById("goalTarget").value="";

};

//---------------------------
// DASHBOARD
//---------------------------

function updateDashboard(){

    goalCounter.textContent=goals.length;

    let completed=0;

    let total=0;

    goals.forEach(goal=>{

        total+=goal.progress/goal.target;

        if(goal.progress>=goal.target){

            completed++;

        }

    });

    completedCounter.textContent=completed;

    let percent=0;

    if(goals.length>0){

        percent=Math.round(
            total/goals.length*100
        );

    }

    globalPercent.textContent=
        percent+"%";

}

//---------------------------
// RENDER
//---------------------------

function render(){

    goalsContainer.innerHTML="";

    let visible=0;

    const text=
        search.value.toLowerCase();

    goals.forEach(goal=>{

        const completed=
            goal.progress>=goal.target;

        if(
            !goal.name
            .toLowerCase()
            .includes(text)
        ){

            return;

        }

        if(
            filter.value=="completed"
            &&
            !completed
        ){

            return;

        }

        if(
            filter.value=="pending"
            &&
            completed
        ){

            return;

        }

        visible++;

        const percent=
            Math.min(
                100,
                goal.progress/goal.target*100
            );

        goalsContainer.innerHTML+=`

<div
class="bg-slate-900 rounded-3xl p-6 border border-slate-800">

<div class="flex justify-between">

<div>

<div class="text-4xl">

${goal.emoji}

</div>

<h2
class="text-2xl font-bold mt-2">

${goal.name}

</h2>

<p
class="text-slate-400">

${goal.category}

</p>

</div>

<div
class="text-right">

<div
class="text-sm text-slate-400">

Meta

</div>

<div
class="text-xl font-bold">

${goal.target}

${goal.unit}

</div>

</div>

</div>

<div
class="mt-6">

<div
class="h-4 bg-slate-800 rounded-full overflow-hidden">

<div

style="width:${percent}%;background:${goal.color}"

class="h-full rounded-full">

</div>

</div>

<div
class="flex justify-between mt-3">

<div>

${goal.progress}

/

${goal.target}

${goal.unit}

</div>

<div>

${Math.round(percent)}%

</div>

</div>

</div>

<div
class="flex gap-3 mt-8">

<button

onclick="subtractProgress(${goal.id})"

class="flex-1 bg-slate-700 rounded-xl py-3">

➖

</button>

<button

onclick="addProgress(${goal.id})"

class="flex-1 bg-blue-600 rounded-xl py-3">

➕

</button>

<button

onclick="deleteGoal(${goal.id})"

class="flex-1 bg-red-600 rounded-xl py-3">

🗑

</button>

</div>

</div>

`;

    });

    emptyState.classList.toggle(
        "hidden",
        visible!==0
    );

    updateDashboard();

}
//===========================
// SUMAR PROGRESO
//===========================

function addProgress(id){

    const goal = goals.find(g => g.id === id);

    if(!goal) return;

    goal.progress++;

    if(goal.progress > goal.target){

        goal.progress = goal.target;

    }

    save();

    render();

}

//===========================
// RESTAR PROGRESO
//===========================

function subtractProgress(id){

    const goal = goals.find(g => g.id === id);

    if(!goal) return;

    goal.progress--;

    if(goal.progress < 0){

        goal.progress = 0;

    }

    save();

    render();

}

//===========================
// ELIMINAR
//===========================

function deleteGoal(id){

    if(!confirm("¿Eliminar este objetivo?")){

        return;

    }

    goals = goals.filter(goal => goal.id !== id);

    save();

    render();

}

//===========================
// BUSCADOR
//===========================

search.addEventListener("input", render);

//===========================
// FILTROS
//===========================

filter.addEventListener("change", render);

//===========================
// MODO OSCURO
//===========================

const themeButton = document.getElementById("themeButton");

let darkMode = true;

themeButton.addEventListener("click", ()=>{

    darkMode = !darkMode;

    if(darkMode){

        document.body.classList.remove("bg-white");
        document.body.classList.remove("text-black");

        document.body.classList.add("bg-slate-950");
        document.body.classList.add("text-white");

        themeButton.textContent="🌙";

    }else{

        document.body.classList.remove("bg-slate-950");
        document.body.classList.remove("text-white");

        document.body.classList.add("bg-white");
        document.body.classList.add("text-black");

        themeButton.textContent="☀️";

    }

});

//===========================
// ATAJO ESC
//===========================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        hideModal();

    }

});

//===========================
// CERRAR MODAL
//===========================

goalModal.addEventListener("click",(e)=>{

    if(e.target===goalModal){

        hideModal();

    }

});

//===========================
// INICIO
//===========================

loadDate();

render();

showToast("Momentum iniciado 🚀");
