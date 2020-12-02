let fsbtn = document.getElementById("friendsearchbtn"),
    vkidinput = document.getElementById("vkidinput"),
    form = document.getElementById("getuserform");

window.isInt = function (value) {
    return !isNaN(value) && 
            parseInt(Number(value)) == value && 
            !isNaN(parseInt(value, 10));
}

// fsbtn.addEventListener("click", getUser);
form.addEventListener("submit", getUser);
function getUser (e) {
    e.preventDefault();
    if (!vkidinput.value) {
        warnPush({message: "Введите id пользователя для получения диалога"});
        return;
    }
    if (vkidinput.value == 0) { // !isInt(vkidinput.value) || 
        warnPush({message: "Id пользователя не может быть 0"});
        return;
    }
    fetch(`${api_url}users.get?user_ids=${vkidinput.value}&fields=photo_200,last_seen,online&access_token=${localStorage.getItem("vktoken")}&v=${v}`, {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
    .then(function (r) {
            if (!r.ok) {
                errorPush({message: "Ошибка запроса, обратитесь к разработчику"});
                // alert("Ошибка запроса, обратитесь к разработчику");
                return;
            }
            return r.json();
        })
    .then(function(rjson){
            if(rjson.error){
                if (rjson.error.error_code == 5) {
                    warnPush({title: "Ошибка", message: "Неверный токен\n" + rjson.error.error_msg});
                    // alert("Неверный токен\n" + rjson.error.error_msg);
                } else if (rjson.error.error_code == 15) {
                    warnPush({title: "Ошибка", message: "Доступ токена к сообщениям запрещён\n" + rjson.error.error_msg});
                    // alert("Доступ токена к сообщениям запрещён\n" + rjson.error.error_msg);
                } 
                else {
                    errorPush({title: "Ошибка", message: "Code: " + rjson.error.error_code + "\nText: " + rjson.error.error_msg});
                    // alert("Ошибка.\nCode: " + rjson.error.error_code + "\nText: " + rjson.error.error_msg);
                }
                return;
            }
            if (rjson.response) {
                console.log("Get user");
                console.log(rjson);
                console.log();

                // сброс
                document.querySelector(".emptyhistorymessage").style.display = "none";

                // оформляем поле пользователя
                let lastimg = document.querySelector(".chatter-img");
                if (lastimg) {
                    lastimg.remove();
                }
                let ava = document.createElement("img");
                ava.src = rjson.response[0].photo_200
                ava.classList.add("chatter-img");
                
                document.querySelector(".chatter-img-wrap").append(ava);
                document.querySelector(".profile").style.display = "flex";
                let name = document.querySelector(".name");
                name.innerText = rjson.response[0].first_name + " " + rjson.response[0].last_name;
                name.href = "https://vk.com/id" + rjson.response[0].id;

                let devices = ["m.vk.com", "IOS", "IPad", "Android", "WinPhone", "Win10", "vk.com"]

                if (!rjson.response[0].online) {
                    let lastseen = new Date(rjson.response[0].last_seen.time * 1000);
                    console.log(lastseen.getUTCDay());
                    document.querySelector(".lastseen").innerText = `Last seen: ${lastseen.getHours()}:${lastseen.getMinutes() + 1} ${lastseen.getDate()}.${lastseen.getMonth()}.${lastseen.getFullYear()}`;
                }
                else {
                    document.querySelector(".lastseen").innerText = `online(${devices[rjson.response[0].last_seen.platform - 1]})`
                }

                // оформляем чат
                getHistory(rjson.response[0].id).then( history => {
                    console.log(history);
                    if (history == -1) {
                        document.querySelector(".emptyhistorymessage").style.display = "inline";
                    } else if (!history) {
                        errorPush({message: "Ошибка при получении истории сообщений"});
                    }
                    
                    let msgblock = document.querySelector(".messages");

                    history.forEach(element => {
                        let node = document.createElement("div");
                        node.classList.add("message-node");
                        let msgtime = new Date(element[0] * 1000);

                        let from_id = document.createElement("a"),
                            msgtimespan = document.createElement("span"),
                            textspan = document.createElement("span");

                        
                            
                        msgtimespan.innerText =  `${msgtime.getDate()}.${msgtime.getMonth()}.${msgtime.getFullYear()} ${msgtime.getHours()}:${msgtime.getMinutes() + 1} (`;
                        from_id.innerText = element[1];
                        from_id.href = "https://vk.com/id" + element[1];
                        textspan.innerText = "): " + element[3];

                        node.appendChild(msgtimespan);
                        node.appendChild(from_id);
                        node.appendChild(textspan);
                        msgblock.appendChild(node);
                    });

                });
                
                
            } else {
                errorPush({message: "Необработанная ошибка, обратитесь к разработчику"});
                // alert("Необработанная ошибка, обратитесь к разработчику");
                console.log(rjson);
            }
        })
    .catch(err => {
        console.log(err);
        errorPush({message: "Ошибка во время запроса, обратитесь к разработчику"});
    });
}