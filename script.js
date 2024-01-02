import { $addButton, $todoInput, $todoList } from "./element.js";
import {
    sanitizeInput,
    clearInputField,
    displayPropertySetter,
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
        isEditing: false,
    });
    clearInputField($todoInput);

    renderTodos(todos);
};

const deleteTodoHandler = (todoId) => {
    todos = todos.filter((todo) => todo.id !== todoId);
    renderTodos(todos);
};

const editTodoHandler = (
    e,
    inputElement,
    paragraphElement,
    cancelButton,
    todo
) => {
    const $buttonElement = e.target;

    if (!todo.isEditing) {
        $buttonElement.innerText = "Update";
        inputElement.value = todo.title;

        displayPropertySetter(inputElement, "inline-block");
        displayPropertySetter(cancelButton, "inline-block");
        displayPropertySetter(paragraphElement, "none");

        todo.isEditing = true;
    } else {
        if (!inputElement.value) {
            alert("You can not update an empty title.");
            return;
        }

        $buttonElement.innerText = "Edit";
        paragraphElement.textContent = inputElement.value;

        displayPropertySetter(inputElement, "none");
        displayPropertySetter(cancelButton, "none");
        displayPropertySetter(paragraphElement, "inline-block");

        todo.title = inputElement.value;
        todo.isEditing = false;
    }
};

const cancelEditingTodoHandler = (
    e,
    inputElement,
    paragraphElement,
    editButton,
    todo
) => {
    displayPropertySetter(inputElement, "none");
    displayPropertySetter(e.target, "none");
    displayPropertySetter(paragraphElement, "inline-block");

    editButton.innerText = "Edit";
    todo.isEditing = false;
};

const createTodoElement = (todo) => {
    const $todo = document.createElement("li");
    const $paragraphElement = document.createElement("p");
    const $deleteButton = document.createElement("button");
    const $editButton = document.createElement("button");
    const $inputElement = document.createElement("input");
    const $cancelButton = document.createElement("button");

    $paragraphElement.innerText = todo.title;
    $inputElement.value = todo.title;

    $deleteButton.innerText = "Delete";
    $editButton.innerText = "Edit";
    $cancelButton.textContent = "Cancel";

    displayPropertySetter($cancelButton, "none");
    displayPropertySetter($inputElement, "none");

    $deleteButton.addEventListener("click", () => deleteTodoHandler(todo.id));

    $editButton.addEventListener("click", (e) =>
        editTodoHandler(
            e,
            $inputElement,
            $paragraphElement,
            $cancelButton,
            todo
        )
    );

    $cancelButton.addEventListener("click", (e) =>
        cancelEditingTodoHandler(
            e,
            $inputElement,
            $paragraphElement,
            $editButton,
            todo
        )
    );

    $todo.append(
        $paragraphElement,
        $inputElement,
        $deleteButton,
        $editButton,
        $cancelButton
    );

    return $todo;
};

const renderTodos = (todos) => {
    $todoList.innerHTML = "";
    todos.forEach((todo) => {
        $todoList.appendChild(createTodoElement(todo));
    });
};

$addButton.addEventListener("click", addTodoHandler);
