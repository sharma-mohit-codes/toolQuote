
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
        let html= `<div class="card">
                            <div class="left">
                                <input type="checkbox" id="tick">
                                <p>${text.value}</p>
                            </div>
                            
                            <button class="cross">X</button>
                        </div>`
        document.querySelector(".tasks").innerHTML+= html;
        text.value="";
    }
})
