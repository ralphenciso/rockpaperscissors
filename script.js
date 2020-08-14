let icons = {
    R:"https://img.icons8.com/color/96/000000/hand-rock.png",
    P: "https://img.icons8.com/color/96/000000/hand.png",
    S: "https://img.icons8.com/color/96/000000/hand-scissors.png"
}

let btnStart = document.querySelector("#start");
let players = document.querySelectorAll("form input");
let reset = document.querySelector("#reset");
let cPlayer1 = document.querySelector("#cPlayer1");
let cPlayer2 = document.querySelector("#cPlayer2");
let arrPlayers = [];
let hand = ["R","P","S"];
let result = {RP: "P", RP:"P", PS: "S",SP:"S",SR:"R", RS:"R"};
let icon1 = document.querySelector("#icon1");
let icon2 = document.querySelector("#icon2");
let iconCon1 = document.querySelector("#iconCon1");
let iconCon2 = document.querySelector("#iconCon2");
let shuffle = document.querySelector("#shuffleAnimation");
let textResult = document.querySelector("#result");
let winnersList = document.querySelector("#winnersList");
let draw = false;

btnStart.addEventListener('click', e => {
    e.preventDefault();
    btnStart.disabled = true;
    arrPlayers = [];
    Array.from(players).forEach(ele => {
        ele.disabled =  true;
        ele.classList.remove("eliminated");
        if(ele.value) arrPlayers.push(ele.value)
    })

    if(!arrPlayers.length) {
        alert("please enter players");
        reset.click();
        return;
    }

    let arrCopy = [...arrPlayers];
    let winners = [];
    let [cP1, cP2, remaining] = pick2(arrCopy);
    arrCopy = remaining;
    cPlayer1.innerHTML = cP1;
    cPlayer2.innerHTML = cP2;

    playMatch();

    function playMatch(){
        pickHand(() => {
            diplayResult();
            setTimeout(repeat, 1000);
        });
    }
    
    function diplayResult(){
        let winner = getResult();
        
        if(!winner){
            winner = "Draw, play again!";
            draw = true;
        } else{
            winners.push(winner);
            updateWinnerList();
        } 

        textResult.innerHTML = `<h4> ${winner} Won</h4>`;
        textResult.style.display = "block";
    }


    function updateWinnerList(){
        winnersList.innerHTML = `<li class="collection-header"><h5>Winners</h5></li>`;
        winners.forEach(w =>{
        let listItem = document.createElement("li");
            listItem.classList.add("collection-item");
            listItem.innerHTML = w;
            winnersList.appendChild(listItem)
        })
    }

    function repeat(){
        textResult.style.display = "none";
        
        if(draw){
            draw = false;
            playMatch();
            return;
        }

        if(arrCopy.length < 2){
            if(arrCopy.length) winners.push(arrCopy[0]);
            arrCopy = winners;
            winners = [];
            updateWinnerList();
        }

        if(arrCopy.length == 1) {
            textResult.innerHTML = `<h4> Game Over: ${arrCopy[0]} won the tournament!!!</h4>`;
            textResult.style.display = "block";
            return;
        }

        [cP1, cP2, arrCopy] = pick2(arrCopy);
        cPlayer1.innerHTML = cP1;
        cPlayer2.innerHTML = cP2;
        playMatch()
    }



})

// reset.addEventListener('click', e => {
//     players.forEach(e => e.disabled = false)
// })


function pick2(arr){
    let arrCopy = [...arr];
    let l = arrCopy.length;
    let first = arrCopy.splice([Math.floor(Math.random() * l)],1)[0];
    let second = arrCopy.splice([Math.floor(Math.random() * (l-1))],1)[0]
    return [first,second,arrCopy]
}


function pickHand(callback){
    let anim1 = handAnimation.cloneNode(true);
    let anim2 = handAnimation.cloneNode(true);
    iconCon1.innerHTML = "";
    iconCon2.innerHTML = "";
    iconCon1.appendChild(anim1);
    iconCon2.appendChild(anim2);
    
    setTimeout(() => {
        let h1 = hand[Math.floor(Math.random() *3)];
        let h2 = hand[Math.floor(Math.random() *3)]
        
        // while(h1 == h2){
        //     h1 = hand[Math.floor(Math.random() *3)];
        //     h2 = hand[Math.floor(Math.random() *3)];
        // }

        cPlayer1.dataset.hand = h1;
        cPlayer2.dataset.hand = h2;
        icon1.src = icons[h1];
        icon2.src = icons[h2];
        iconCon1.innerHTML = "";
        iconCon2.innerHTML = "";
        iconCon1.appendChild(icon1);
        iconCon2.appendChild(icon2);
        callback();
    }, 2000)
}


var handAnimation = document.createElement('div');
handAnimation.id = "shuffleAnimation";
handAnimation.innerHTML = 
`<img id="icon1" class="spinner" src="https://img.icons8.com/color/96/000000/hand-rock.png"/>
<img id="icon2" class="spinner" src="https://img.icons8.com/color/96/000000/hand-scissors.png"/>
<img id="icon2" class="spinner" src="https://img.icons8.com/color/96/000000/hand.png"/>
<img id="icon1" class="spinner" src="https://img.icons8.com/color/96/000000/hand-rock.png"/>
`



function getResult(){
    let hands =  [cPlayer1.dataset.hand, cPlayer2.dataset.hand]
    let winner = result[hands[0] + hands[1]];

    if(!winner) return false;

    if(hands.indexOf(winner)) {
        eliminate(cPlayer1.innerHTML)
        return cPlayer2.innerHTML    
    } else {
        eliminate(cPlayer2.innerHTML)
        return cPlayer1.innerHTML           
    }
}


function eliminate(string){
    Array.from(players).forEach(ele =>{ 
        if (ele.value == string) ele.classList.add("eliminated")  
    });
}