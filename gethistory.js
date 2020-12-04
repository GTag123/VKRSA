
window.getHistory = function (id) {

    return fetch(`${api_url}messages.getHistory?user_id=${id}&count=50&access_token=${localStorage.getItem("vktoken")}&v=${v}`, {
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
                console.log("Get history");
                console.log(rjson);
                console.log();
                
                if (rjson.response.items.length == 0) {
                    return -1;
                }

                let messages = []; // [UTC, fromid, peerid, text]
                
                rjson.response.items.forEach(element => {
                    messages.push([element.date, element.from_id, element.peer_id, element.text]);
                });
                return messages;

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