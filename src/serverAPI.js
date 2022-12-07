export function httpGet(url, callback = console.log) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        // if (xhr.readyState == 4) {
        //     callback(xhr.responseText);
        // }
        if (xhr.status == 200) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

export function httpPost(url, data, callback = console.log) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        // call the callback when the request is complete
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify(data));
}

export function defineSpanishWord(word, callback = console.log, trys = 0) {
    if (word == "" || word == null || word == undefined || word == " " || trys == 2) {
        return;
    }
    httpGet("https://dictionaryapi.com/api/v3/references/spanish/json/" + word + "?key=19095fed-248e-400d-816b-79843407fc92", (data) => {
        try {
            console.log(data);
            // var thing = JSON.parse(data.substring(1, data.length - 1))
            var thing = JSON.parse(data)

            console.log(thing)

            try {

                var arr = []
                for (var i = 0; i < thing.length; i++) {
                    var def = thing[i].shortdef[0];
                    if (def != undefined) {
                        arr.push(def);
                    }
                }

                // var definition = thing[0].shortdef[0]
                // var count = 1
                // while (definition == undefined) {
                //     definition = thing[count].shortdef[0]
                //     count++
                // }
                // console.log("definition: " + definition)
                console.log(arr);
                callback(arr)
            }
            catch (e) {
                defineSpanishWord(thing[0], callback, trys + 1)
                console.log(e)
            }
        }
        catch (e) {

            callback([])

        }

    })
}