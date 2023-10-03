"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let _txtarea = "";
let _taskID = 0;
function onLoad() {
    loadData();
}
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch("http://192.168.1.13:8080/api/task");
        let json = yield response.json();
        let tasks = json;
        let cont = document.getElementById("lista");
        if (cont == null) {
            return;
        }
        cont.innerHTML = "";
        for (let i = 0; i < tasks.length; i++) {
            let li = document.createElement("li");
            li.innerHTML = tasks[i].Description;
            if (tasks[i].Completed) {
                li.classList.add("checked");
            }
            li.onclick = function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (tasks[i].Completed) {
                        yield fetch("http://192.168.1.13:8080/api/undoTask/" + tasks[i].Id, {
                            method: 'PUT',
                        });
                        li.classList.remove("checked");
                    }
                    else {
                        yield fetch("http://192.168.1.13:8080/api/doTask/" + tasks[i].Id, {
                            method: 'PUT',
                        });
                        li.classList.add("checked");
                    }
                    //instead of reload, sync with server
                    tasks[i].Completed = !tasks[i].Completed;
                });
            };
            let span = document.createElement("span");
            span.innerHTML = "\u00d7";
            span.id = "" + tasks[i].Id;
            span.onclick = function () {
                deleteOne(tasks[i].Id);
            };
            let btn = document.createElement("button");
            btn.innerHTML = "Update";
            btn.classList.add("updateBtn");
            btn.onclick = function (event) {
                event.stopPropagation();
                let txt = document.getElementById("textBox");
                if (txt != null) {
                    txt.value = tasks[i].Description;
                }
                let addBtn = document.getElementById("addBtn");
                if (addBtn != null) {
                    addBtn.innerHTML = "Update";
                }
                _taskID = tasks[i].Id;
            };
            li.appendChild(btn);
            li.appendChild(span);
            cont.appendChild(li);
        }
    });
}
function newTask() {
    return __awaiter(this, void 0, void 0, function* () {
        let btn = document.getElementById("addBtn");
        if (btn == null) {
            return;
        }
        if (btn.innerHTML == "Add") {
            yield fetch("http://192.168.1.13:8080/api/task", {
                method: 'POST',
                body: JSON.stringify({ Description: _txtarea })
                // body: "{\"Description\":\"" + _txtarea + "\"}"
            });
        }
        else {
            yield updateTask(_taskID);
            btn.innerHTML = "Add";
        }
        let text = document.getElementById("textBox");
        if (text != null) {
            text.value = "";
        }
        onLoad();
    });
}
function updateTextarea(str) {
    _txtarea = str;
}
function deleteAll() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch("http://192.168.1.13:8080/api/deleteAllTask", {
            method: 'DELETE',
        });
        onLoad();
    });
}
function deleteOne(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = "http://192.168.1.13:8080/api/task/" + id;
            console.log("DELETE:", url);
            yield fetch(url, {
                method: 'DELETE',
            });
            //if above throws, bellow doesn't happen...
            //when exception is throwed code stops
            onLoad();
        }
        catch (err) {
            console.log(err);
        }
    });
}
function updateTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch("http://192.168.1.13:8080/api/task/" + id, {
            method: 'PUT',
            body: JSON.stringify({ Description: _txtarea })
            //body: "{\"Description\":\"" + _txtarea + "\"}"
        });
    });
}
//# sourceMappingURL=index.js.map