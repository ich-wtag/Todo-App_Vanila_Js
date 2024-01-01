import { $addButton, $todoInput, $todoList } from "./element.js";
import { sanitizeInput, clearInputField } from "./utility.js";

let todos = [];
let inputValue;

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

const editTodoHandler = (e, todo, inputButton) => {
    const $buttonElement = e.target;
    const $parentElement = $buttonElement.parentNode;
    const $paragraphElement = $parentElement.querySelector("p");

    if (!todo.isEditing) {
        $buttonElement.innerText = "Update";
        inputButton.style.display = "inline-block";
        $paragraphElement.style.display = "none";
        todo.isEditing = true;
    } else {
        $buttonElement.innerText = "Edit";
        inputButton.style.display = "none";
        $paragraphElement.textContent = inputValue;
        $paragraphElement.style.display = "inline-block";

        todo.title = inputValue;
        todo.isEditing = false;
    }
};

const createTodoElement = (todo) => {
    const $todo = document.createElement("li");
    const $deleteButton = document.createElement("button");
    const $editButton = document.createElement("button");
    const $inputElement = document.createElement("input");

    $inputElement.value = todo.title;

    // const $cancelButton = document.createElement("button");
    // $cancelButton.textContent = "Cancel";

    // $cancelButton.addEventListener("click", () => {
    //     inputButton.style.display = "none";
    //     $paragraphElement.style.display = "inline-block";

    //     $cancelButton.remove();
    // });

    // $cancelButton.addEventListener("click", () => {
    //     $todo.innerHTML = `<p>${todo.title}</p>`;
    // });
    $inputElement.addEventListener("input", (e) => {
        inputValue = e.target.value;
        return inputValue;
    });

    $inputElement.style.display = "none";

    $deleteButton.innerText = "Delete";
    $editButton.innerText = "Edit";

    $deleteButton.addEventListener("click", () => deleteTodoHandler(todo.id));
    $editButton.addEventListener("click", (e) =>
        editTodoHandler(e, todo, $inputElement)
    );

    $todo.innerHTML = `<p>${todo.title}</p>`;
    $todo.append($inputElement, $deleteButton, $editButton);

    return $todo;
};

const renderTodos = (todos) => {
    $todoList.innerHTML = "";
    todos.forEach((todo) => {
        $todoList.appendChild(createTodoElement(todo));
    });
};

$addButton.addEventListener("click", addTodoHandler);
