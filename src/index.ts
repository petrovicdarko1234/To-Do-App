let _txtarea = ""
let _taskID = 0

function onLoad() {
    loadData()
}

type Task = {
    Id: number
    Description: string
    Completed: boolean
}

async function loadData() {

    let response = await fetch("http://192.168.1.13:8080/api/task")

    let json = await response.json()
    let tasks = json as Task[]

    let cont = document.getElementById("lista")
    if (cont == null) {
        return
    }

    cont.innerHTML = ""
    for (let i = 0; i < tasks.length; i++) {

        let li = document.createElement("li")

        li.innerHTML = tasks[i].Description

        if (tasks[i].Completed) {
            li.classList.add("checked")
        }
        li.onclick = async function () {
            if (tasks[i].Completed) {
                await fetch("http://192.168.1.13:8080/api/undoTask/" + tasks[i].Id, {
                    method: 'PUT',
                })
                li.classList.remove("checked")
            } else {
                await fetch("http://192.168.1.13:8080/api/doTask/" + tasks[i].Id, {
                    method: 'PUT',
                })
                li.classList.add("checked")
            }
            //instead of reload, sync with server
            tasks[i].Completed = !tasks[i].Completed
        }
        let span = <HTMLSpanElement>document.createElement("span")
        span.innerHTML = "\u00d7"
        span.id = "" + tasks[i].Id
        span.onclick = function () {
            deleteOne(tasks[i].Id)
        }
        let btn = <HTMLButtonElement>document.createElement("button")
        btn.innerHTML = "Update"
        btn.classList.add("updateBtn")
        btn.onclick = function (event) {
            event.stopPropagation()

            let txt = <HTMLTextAreaElement>document.getElementById("textBox")
            if (txt != null) {
                txt.value = tasks[i].Description
            }

            let addBtn = document.getElementById("addBtn")
            if (addBtn != null) {
                addBtn.innerHTML = "Update"
            }
            _taskID = tasks[i].Id
        }
        li.appendChild(btn)
        li.appendChild(span)
        cont.appendChild(li)
    }
}
async function newTask() {
    let btn = document.getElementById("addBtn")
    if (btn == null) {
        return
    }
    if (btn.innerHTML == "Add") {
        await fetch("http://192.168.1.13:8080/api/task", {
            method: 'POST',
            body: JSON.stringify({ Description: _txtarea })
            // body: "{\"Description\":\"" + _txtarea + "\"}"
        })

    } else {
        await updateTask(_taskID)
        btn.innerHTML = "Add"
    }
    let text = <HTMLTextAreaElement>document.getElementById("textBox")
    if (text != null) {
        text.value = ""
    }
    onLoad()
}

function updateTextarea(str: string) {
    _txtarea = str
}

async function deleteAll() {
    await fetch("http://192.168.1.13:8080/api/deleteAllTask", {
        method: 'DELETE',
    })
    onLoad()
}

async function deleteOne(id: number) {
    try {
        const url = "http://192.168.1.13:8080/api/task/" + id
        console.log("DELETE:", url)
        await fetch(url, {
            method: 'DELETE',
        })

        //if above throws, bellow doesn't happen...
        //when exception is throwed code stops
        onLoad()
    } catch (err) {
        console.log(err)
    }
}
async function updateTask(id: number) {
    await fetch("http://192.168.1.13:8080/api/task/" + id, {
        method: 'PUT',
        body: JSON.stringify({ Description: _txtarea })
        //body: "{\"Description\":\"" + _txtarea + "\"}"
    })
}
