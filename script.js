import { $addButton, $todoInput, $todoList } from "./element.js";
import {
    sanitizeInput,
    clearInputField,
    eventListenerHandler,
} from "./utility.js";

let todos = [];

const addTodoHandler = () => {
    const todoTitle = sanitizeInput($todoInput.value).trim();
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

eventListenerHandler($addButton, "click", addTodoHandler);
