
function equal(){
    let expr=resultBox.textContent;
    expr=expr.replace(/×/g,"*").replace(/÷/g,"/");
    try{
        resultBox.textContent=eval(expr);
    }
    catch{
        resultBox.textContent="Error"
    }
}

document.querySelector(".front").addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        e.preventDefault();
        equal();
    }
    else if(e.key==="Backspace"){
        resultBox.textContent= resultBox.textContent.slice(0,-1)
    }
    else if((e.key>="0" && e.key<="9")||(["-","+","*","/","%"].includes(e.key))){
    resultBox.textContent+= e.key;
    }
})

const resultBox= document.querySelector(".result");
document.querySelectorAll(".btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
        let val=btn.textContent;
        if(val=="="){
           equal();
        }
        else if(val=="⌫"){
            resultBox.textContent= resultBox.textContent.slice(0,-1)
        }
        else if(val=="AC"){
            resultBox.textContent=""
        }
        else{
            
            resultBox.textContent +=val;
        }
    })
})


// TO DO JS

function getHTML(text){
return `<div class="card">
                            <div class="left">
                                <input type="checkbox" class="tick">
                                <p>${text}</p>
                            </div>
                            
                            <button class="cross">X</button>
                        </div>`
}

let tasks=getTasks();
render();

let add= document.querySelector(".add");
    add.addEventListener("click",()=>{
    let text=document.querySelector("#text");
    if(text.value==""){
        let hidden= document.querySelector(".hidden");
        hidden.classList.add("show");
        setTimeout(() => {
            hidden.classList.remove("show");
        }, 2000);
    }
    else{
        tasks.push({text:text.value,done:false});
        saveTasks(tasks);
        render();
        text.value="";
    }
    });



function saveTasks(tasks){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function getTasks(){
    let stored= localStorage.getItem("tasks");
    try{
        return stored?JSON.parse(stored):[];
    }
    catch(e){
        localStorage.removeItem("tasks");
        return [];
    }
}

function render(){
    let block= document.querySelector(".tasks");
    block.innerHTML="";
    tasks.forEach((t,e)=>{
        let html=getHTML(t.text);
        block.innerHTML+=html;
    })

    document.querySelectorAll(".tick").forEach((chk,i)=>{
        chk.checked=tasks[i].done;
        chk.addEventListener("change",()=>{
            tasks[i].done=chk.checked;
            saveTasks(tasks);
        });
    });

    document.querySelectorAll(".cross").forEach((btn,i)=>{
        btn.addEventListener("click",()=>{
            tasks.splice(i,1);
            saveTasks(tasks);
            render();
        });
    });

    document.querySelectorAll(".left p").forEach((object,i)=>{
        object.addEventListener("click",()=>{
            tasks[i].done= !tasks[i].done;
            saveTasks(tasks);
            render();
        });
    });
}

