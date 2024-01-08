import {
    $addButton,
    $todoInput,
    $todoList,
    $errorMessageElement,
    $searchInput,
    $searchButton,
    $allTodoButton,
    $completeTodoButton,
    $incompleteTodoButton,
} from "./element.js";
import { sanitizeInput, clearInputField, showErrorMessage } from "./utility.js";

let todos = [];
let searchedArray = [];
let filteredArray = [];

let isSearched = false;
let filterValue = "all";

const addTodoHandler = () => {
    const todoTitle = sanitizeInput($todoInput.value).trim();
    if (!todoTitle.length) {
        showErrorMessage(
            "You can not add a todo item without any title. Please add a title"
        );
        return;
    }

    $errorMessageElement.classList.add("hide");
    todos.unshift({
        id: new Date().getTime(),
        title: todoTitle,
        isEditing: false,
        isCompleted: false,
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
        todo.isEditing = true;
    } else if (todo.isEditing && !inputElement.value.trim()) {
        showErrorMessage(
            "You can not update an todo without any title. Please add a title"
        );

        return;
    } else {
        $errorMessageElement.classList.add("hide");
        $buttonElement.innerText = "Edit";
        paragraphElement.textContent = sanitizeInput(inputElement.value).trim();
        todo.title = sanitizeInput(inputElement.value).trim();
        todo.isEditing = false;
    }

    inputElement.classList.toggle("hide");
    cancelButton.classList.toggle("hide");
    paragraphElement.classList.toggle("hide");
};

const cancelEditingTodoHandler = (
    e,
    inputElement,
    paragraphElement,
    editButton,
    todo
) => {
    inputElement.classList.add("hide");
    e.target.classList.add("hide");
    paragraphElement.classList.remove("hide");
    $errorMessageElement.classList.add("hide");

    editButton.innerText = "Edit";
    todo.isEditing = false;
};

const markDoneTodoHandler = (
    e,
    paragraphElement,
    editButton,
    inputElement,
    cancelButton,
    todo
) => {
    if (!inputElement.value.trim()) {
        showErrorMessage(
            "You can not make done a todo without any title. Please add a title"
        );
        return;
    }
    if (paragraphElement.classList.contains("hide")) {
        paragraphElement.innerText = sanitizeInput(inputElement.value).trim();
        paragraphElement.classList.remove("hide");
        $errorMessageElement.classList.add("hide");
    }

    paragraphElement.classList.add("done-todo");
    e.target.classList.add("hide");
    editButton.classList.add("hide");
    inputElement.classList.add("hide");
    cancelButton.classList.add("hide");

    todo.title = inputElement.value;
    todo.isCompleted = true;
    filterTodosHandler(filterValue);
};

const searchHandler = () => {
    let searchedValue = $searchInput.value.toLowerCase().trim();
    isSearched = searchedValue.length ? true : false;

    searchedArray = todos.filter((todo) => todo.title.includes(searchedValue));

    filterTodosHandler(filterValue);
};

const filterTodosHandler = (toFilterValue) => {
    let tobeFilteredArray = isSearched ? searchedArray : todos;

    switch (toFilterValue) {
        case "incomplete":
            filteredArray = tobeFilteredArray.filter(
                (todo) => !todo.isCompleted
            );
            break;

        case "complete":
            filteredArray = tobeFilteredArray.filter(
                (todo) => todo.isCompleted
            );
            break;

        default:
            filteredArray = [...tobeFilteredArray];
            break;
    }

    filterValue = toFilterValue;
    renderTodos(filteredArray);
    todo.title = sanitizeInput(inputElement.value).trim();
    todo.isComplete = true;
};

const createTodoElement = (todo) => {
    const $todo = document.createElement("li");
    const $paragraphElement = document.createElement("p");
    const $deleteButton = document.createElement("button");
    const $editButton = document.createElement("button");
    const $inputElement = document.createElement("input");
    const $cancelButton = document.createElement("button");
    const $doneButton = document.createElement("button");

    $paragraphElement.innerText = todo.title;
    $inputElement.value = todo.title;

    $deleteButton.innerText = "Delete";
    $editButton.innerText = "Edit";
    $cancelButton.textContent = "Cancel";
    $doneButton.textContent = "Done";

    $cancelButton.classList.add("hide");
    $inputElement.classList.add("hide");

    if (todo.isCompleted) {
        $paragraphElement.classList.add("done-todo");
        $doneButton.classList.add("hide");
        $editButton.classList.add("hide");
    }

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

    $doneButton.addEventListener("click", (e) =>
        markDoneTodoHandler(
            e,
            $paragraphElement,
            $editButton,
            $inputElement,
            $cancelButton,
            todo
        )
    );

    $todo.append(
        $paragraphElement,
        $inputElement,
        $deleteButton,
        $editButton,
        $doneButton,
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
$searchButton.addEventListener("click", searchHandler);
$allTodoButton.addEventListener("click", () => filterTodosHandler("all"));
$incompleteTodoButton.addEventListener("click", () =>
    filterTodosHandler("incomplete")
);
$completeTodoButton.addEventListener("click", () =>
    filterTodosHandler("complete")
);
