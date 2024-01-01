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

const deleteTodoHandler = (todoId) => {
    todos = [...todos].filter((todo) => todo.id !== todoId);

    renderTodos(todos);
};

const createTodoElement = (todo) => {
    const $todo = document.createElement("li");
    const $deleteButton = document.createElement("button");
    $deleteButton.innerText = "Delete";

    eventListenerHandler($deleteButton, "click", () =>
        deleteTodoHandler(todo.id)
    );

    $todo.innerHTML = `<p>${todo.title}</p>`;
    $todo.appendChild($deleteButton);

    return $todo;
};

const renderTodos = (todos) => {
    $todoList.innerHTML = "";
    todos.forEach((todo) => {
        $todoList.appendChild(createTodoElement(todo));
    });
};

eventListenerHandler($addButton, "click", addTodoHandler);
