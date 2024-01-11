import {
    $addButton,
    $todoInput,
    $todoList,
    $errorMessageElement,
    $searchInput,
    $allTodoButton,
    $completeTodoButton,
    $incompleteTodoButton,
    $loadMoreButton,
} from "./element.js";
import {
    sanitizeInput,
    clearInputField,
    showErrorMessage,
    showCompletedTodo,
} from "./utility.js";

import { INCOMPLETE, COMPLETE, DELETEICONSOURCE } from "./const.js";

let todos = [];
let searchedArray = [];

let filteredState = "all";

let endIndex = 9;
const todosNeedToLoad = 6;
let currentPage = 1;
let totalPage = 1;

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

    clearInputField($searchInput);
    filterTodosHandler(filteredState);
};

const deleteTodoHandler = (todoId) => {
    todos = todos.filter((todo) => todo.id !== todoId);
    clearInputField($searchInput);
    filterTodosHandler(filteredState);
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
    } else if (todo.isEditing && !inputElement.value) {
        showErrorMessage(
            "You can not update an todo without any title. Please add a title"
        );

        return;
    } else {
        $errorMessageElement.classList.add("hide");
        $buttonElement.innerText = "Edit";
        paragraphElement.textContent = inputElement.value;
        todo.title = inputElement.value;
        todo.isEditing = false;
    }

    inputElement.classList.toggle("hide");
    cancelButton.classList.toggle("hide");
    paragraphElement.classList.toggle("hide");

    clearInputField($searchInput);
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

    inputElement.classList.add("hide");
    cancelButton.classList.add("hide");

    showCompletedTodo(paragraphElement, editButton, e.target);
    clearInputField($searchInput);

    todo.title = sanitizeInput(inputElement.value).trim();
    todo.isCompleted = true;
    filterTodosHandler(filteredState);
};

const searchHandler = () => {
    const searchedValue = $searchInput.value.toLowerCase().trim();
    searchedArray = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchedValue)
    );

    filterTodosHandler(filteredState);
};

const filterTodosHandler = (stateValue) => {
    let filteredArray = [];
    const isSearched = !!$searchInput.value.trim();

    const tobeFilteredArray = isSearched ? searchedArray : todos;

    switch (stateValue) {
        case INCOMPLETE:
            filteredArray = tobeFilteredArray.filter(
                (todo) => !todo.isCompleted
            );
            break;

        case COMPLETE:
            filteredArray = tobeFilteredArray.filter(
                (todo) => todo.isCompleted
            );
            break;

        default:
            filteredArray = [...tobeFilteredArray];
            break;
    }

    filteredState = stateValue;
    renderTodos(filteredArray);
};

const paginationHandler = () => {
    if (currentPage < totalPage) {
        endIndex += todosNeedToLoad;
        currentPage++;
    } else {
        currentPage = 1;
        endIndex = 9;
    }
    filterTodosHandler(filteredState);
};

const getPaginatedArray = (toBePaginatedArray) => {
    let startIndex = 0;
    totalPage = Math.round((toBePaginatedArray.length - 1) / todosNeedToLoad);

    if (totalPage > 1) {
        $loadMoreButton.classList.remove("hide");
    } else {
        $loadMoreButton.classList.add("hide");
    }
    $loadMoreButton.textContent =
        currentPage < totalPage ? "Load More" : "Show Less";

    return toBePaginatedArray?.slice(startIndex, endIndex);
};

const createTodoElement = (todo) => {
    const $todo = document.createElement("div");
    const $paragraphElement = document.createElement("h3");
    const $iconSource = document.createElement("img");
    const $deleteButton = document.createElement("button");
    const $editButton = document.createElement("button");
    const $inputElement = document.createElement("input");
    const $cancelButton = document.createElement("button");
    const $doneButton = document.createElement("button");

    $todo.classList.add("task");
    $paragraphElement.classList.add("task__title");

    $paragraphElement.innerText = todo.title;
    $inputElement.value = todo.title;
    $iconSource.src = DELETEICONSOURCE;
    $deleteButton.appendChild($iconSource);

    $editButton.innerText = "Edit";
    $cancelButton.textContent = "Cancel";
    $doneButton.textContent = "Done";

    $cancelButton.classList.add("hide");
    $inputElement.classList.add("hide");

    if (todo.isCompleted) {
        showCompletedTodo($paragraphElement, $editButton, $doneButton);
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
    let toBeRanderedTodos = getPaginatedArray(todos);
    toBeRanderedTodos.forEach((todo) => {
        $todoList.appendChild(createTodoElement(todo));
    });
};

$addButton.addEventListener("click", addTodoHandler);
$searchInput.addEventListener("input", searchHandler);
$allTodoButton.addEventListener("click", () => filterTodosHandler("all"));
$incompleteTodoButton.addEventListener("click", () =>
    filterTodosHandler("incomplete")
);
$completeTodoButton.addEventListener("click", () =>
    filterTodosHandler("complete")
);
$loadMoreButton.addEventListener("click", paginationHandler);
