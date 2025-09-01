
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

document.addEventListener("keydown",(e)=>{
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