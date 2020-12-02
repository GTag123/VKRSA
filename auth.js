window.v = "5.126";
window.api_url = "http://mc.tagir.live/api.vk.com/method/";

let authbtn = document.querySelector("#authbtn"),
    tokeninput = document.querySelector("#token-input"),
    auth = document.querySelector(".auth-container"),
    loader = document.querySelector(".loader-wrapper"),
    mainbody = document.querySelector(".main-body");

let isAuth = false;
// let trueToken;

authbtn.addEventListener("click", function(e) {
    if (!tokeninput.value) {
        warnPush({message: 'Вы не ввели токен'});
        // alert("Введите токен!");
        return;
    }
    let token = tokeninput.value;
    auth.style.display = "none";
    loader.style.display = "flex";
    infoPush({message: "Идёт авторизация..."});
    fetch(`${api_url}messages.getConversations?count=1&access_token=${token}&v=${v}`, {
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
                if (localStorage.getItem("vktoken")) {
                    localStorage.removeItem("vktoken");
                }
                return;
            }
            if (rjson.response) {
                successPush({message: "Успешная авторизация"});
                localStorage.setItem('vktoken', token);
                console.log(rjson.response);
                isAuth = true;
                afterAuth(token);
            } else {
                errorPush({message: "Необработанная ошибка, обратитесь к разработчику"});
                // alert("Необработанная ошибка, обратитесь к разработчику");
                console.log(rjson);
            }
        })
    .catch(err => {
        console.log(err);
        errorPush({message: "Ошибка во время запроса, обратитесь к разработчику"});
    })
    .finally(function() {
        if (!isAuth) {
            loader.style.display = "none";
            tokeninput.value = "";
            auth.style.display = "flex";
        }
    });
});

let storagetoken = localStorage.getItem("vktoken");
if (storagetoken) {
    tokeninput.value = storagetoken;
    authbtn.dispatchEvent(new Event("click"));
}

function afterAuth(token) {
    auth.style.display = "none";
    // loader.style.display = "flex";
    infoPush({message: "Загружаем данные профиля"});
    fetch(`${api_url}users.get?fields=photo_50&access_token=${token}&v=${v}`).then(r => r.json()).then(function (data) {
        if (data.response) {
            console.log(data.response);

            let ava = document.createElement("img");
            ava.src = data.response[0].photo_50
            ava.classList.add("ava-img");
            document.querySelector(".ava-wrap").append(ava);
            document.querySelector(".nameblock").innerText = data.response[0].first_name + " " + data.response[0].last_name;
            document.querySelector(".idblock").innerText = "@id" + data.response[0].id;
            document.querySelector(".user-block-link").href = "https://vk.com/id" + data.response[0].id;
            loader.style.display = "none"
            successPush({message: "Данные загружены"});
            mainbody.style.display = "block";

        } else {
            warnPush({message: "Ошибка vk api при получаении информации об аккаунте"});
            console.log(data);
        }
    })
    .catch(function (err) {
        errorPush({message: "Ошибка запроса при получаении информации об аккаунте"});
        console.log(err);
    });
}

document.getElementById("exitbtn").addEventListener('click', function(e) {
    localStorage.removeItem("vktoken");
    tokeninput.value = "";
    mainbody.style.display = "none";
    auth.style.display = "flex";
});