import { sanitizaInput, clearInputField } from "./utility.js";

const $todoInput = document.getElementById("input-field");
const $addButton = document.getElementById("add-button");
const $todoList = document.getElementById("todo-list");

let todos = [];

const addTodoHandler = () => {
    let todoTitle = sanitizaInput($todoInput.value).trim();
    if (!todoTitle.length) {
        alert("Please enter a valid text");
        return;
    }

    todos.unshift({
        id: new Date().getTime(),
        title: todoTitle,
    });
    clearInputField($todoInput);

    renderTodos(todos);
};

const createTodoElement = (todo) => {
    const $todo = document.createElement("li");
    $todo.innerHTML = `<p>${todo.title}</p>`;

    return $todo.outerHTML;
};

const renderTodos = (todos) => {
    $todoList.innerHTML = "";

    $todoList.innerHTML = todos.map((todo) => createTodoElement(todo)).join("");
};

$addButton.addEventListener("click", addTodoHandler);
