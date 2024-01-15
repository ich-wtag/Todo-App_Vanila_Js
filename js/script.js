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
    $searchButton,
    $createButton,
    $inputWrapper,
    $clearButton,
    $blankFieldWrapper,
    $blankTitle,
    $filterButtonWrapper,
} from "./element.js";
import {
    sanitizeInput,
    clearInputField,
    showErrorMessage,
    showCompletedTodo,
    addButtonClasses,
    showCompletedTime,
    showFormattedDate,
    activateFilterButton,
    showBlankTaskWrapper,
    showActiveFilterButton,
} from "./utility.js";

import {
    INCOMPLETE,
    COMPLETE,
    PAGE_LOAD_COUNT,
    INITAIL_PAGE,
    DELETEICON,
    EDITICON,
    DONEICON,
    PLUSICON,
    ALL,
} from "./const.js";

let todos = [];

let filterState = ALL;

let endIndex = 9;
const pageLoadCount = PAGE_LOAD_COUNT;
let currentPage = INITAIL_PAGE;
let totalPage = INITAIL_PAGE;

const showInputWrapper = () => {
    if ($inputWrapper.classList.contains("hide")) {
        $createButton.innerText = "Hide";
    } else {
        $createButton.innerHTML = `${PLUSICON} Create`;
    }
    $inputWrapper.classList.toggle("hide");
    renderTodos();
};

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
        createdAt: new Date().toUTCString(),
        isEditing: false,
        isCompleted: false,
    });
    clearInputField($todoInput);

    clearInputField($searchInput);
    renderTodos();
};

const deleteTodoHandler = (todoId) => {
    todos = todos.filter((todo) => todo.id !== todoId);
    clearInputField($searchInput);
    renderTodos();
};

const editTodoHandler = (
    editButton,
    inputElement,
    headingElement,
    paragraphElement,
    cancelButton,
    deleteButton,
    todo
) => {
    if (!todo.isEditing) {
        editButton.innerHTML = "Save";
        inputElement.value = todo.title;
        todo.isEditing = true;
    } else if (todo.isEditing && !inputElement.value) {
        showErrorMessage(
            "You can not update an todo without any title. Please add a title"
        );

        return;
    } else {
        $errorMessageElement.classList.add("hide");
        editButton.innerHTML = EDITICON;
        headingElement.textContent = inputElement.value;
        todo.title = inputElement.value;
        todo.isEditing = false;
    }

    editButton.classList.toggle("button-secondary");
    deleteButton.classList.toggle("hide");
    inputElement.classList.toggle("hide");
    cancelButton.classList.toggle("hide");
    paragraphElement.classList.toggle("hide");
    headingElement.classList.toggle("hide");

    clearInputField($searchInput);
};

const cancelEditingTodoHandler = (
    cancelButton,
    inputElement,
    headingElement,
    paragraphElement,
    editButton,
    deleteButton,
    todo
) => {
    inputElement.classList.add("hide");
    cancelButton.classList.add("hide");
    headingElement.classList.remove("hide");
    paragraphElement.classList.remove("hide");
    deleteButton.classList.remove("hide");
    $errorMessageElement.classList.add("hide");

    editButton.classList.toggle("button-secondary");
    editButton.innerHTML = EDITICON;
    todo.isEditing = false;
};

const markDoneTodoHandler = (inputElement, todo) => {
    if (!inputElement.value.trim()) {
        showErrorMessage(
            "You can not make done a todo without any title. Please add a title"
        );
        return;
    }

    clearInputField($searchInput);

    todo.title = sanitizeInput(inputElement.value).trim();
    todo.isCompleted = true;
    todo.completedAt = showCompletedTime(todo.createdAt);
    renderTodos();
};

const searchHandler = () => {
    const searchedValue = $searchInput.value.toLowerCase().trim();

    if (searchedValue === "") {
        return todos;
    }
    return todos.filter((todo) => {
        return todo.title.toLowerCase().includes(searchedValue);
    });
};

const toggleSearchBar = () => {
    $searchInput.classList.toggle("hide");
};

const setFilter = (stateValue) => {
    filterState = stateValue;
    renderTodos();
};

const filterHandler = (tobeFilteredArray) => {
    switch (filterState) {
        case INCOMPLETE:
            return tobeFilteredArray.filter((todo) => !todo.isCompleted);

        case COMPLETE:
            return tobeFilteredArray.filter((todo) => todo.isCompleted);

        default:
            return tobeFilteredArray;
    }
};

const paginationHandler = () => {
    if (currentPage < totalPage) {
        currentPage++;
    } else {
        currentPage = INITAIL_PAGE;
    }
    renderTodos();
};

const getPaginatedArray = (todos) => {
    const startIndex = 0;
    const endIndex = currentPage * pageLoadCount;
    totalPage = INITAIL_PAGE + Math.floor((todos.length - 1) / pageLoadCount);

    if (totalPage > 1) {
        $loadMoreButton.classList.remove("hide");
    } else {
        $loadMoreButton.classList.add("hide");
    }
    $loadMoreButton.textContent =
        currentPage < totalPage ? "Load More" : "Show Less";

    return todos?.slice(startIndex, endIndex);
};

const createTodoElement = (todo) => {
    const $todo = document.createElement("div");
    const $headingElement = document.createElement("h3");
    const $paragraphElement = document.createElement("p");
    const $buttonWrapper = document.createElement("div");
    const $deleteButton = document.createElement("button");
    const $editButton = document.createElement("button");
    const $inputElement = document.createElement("textarea");
    const $cancelButton = document.createElement("button");
    const $doneButton = document.createElement("button");
    const $completdBadgeElement = document.createElement("p");
    const $spanElement = document.createElement("span");

    $buttonWrapper.classList.add("flex", "task__button-wrapper");
    addButtonClasses($deleteButton);
    addButtonClasses($editButton);
    addButtonClasses($doneButton);
    addButtonClasses($cancelButton);

    $todo.classList.add("task");
    $headingElement.classList.add("task__title");
    $paragraphElement.classList.add("task__created-at");
    $inputElement.classList.add("task__input");
    $inputElement.rows = 3;

    $headingElement.innerText = todo.title;
    $paragraphElement.innerText = `Created At : ${showFormattedDate(
        todo.createdAt
    )}`;
    $inputElement.value = todo.title;

    $deleteButton.innerHTML = DELETEICON;

    $editButton.innerHTML = EDITICON;

    $doneButton.innerHTML = DONEICON;

    $cancelButton.innerHTML = DELETEICON;

    $completdBadgeElement.innerHTML = `Completed in ${todo.completedAt}`;
    $spanElement.innerText = `${todo.completedAt > 1}` ? " day" : " days";

    $completdBadgeElement.append($spanElement);

    $completdBadgeElement.classList.add("task__completed-badge", "hide");
    $cancelButton.classList.add("hide");
    $inputElement.classList.add("hide");

    if (todo.isCompleted) {
        showCompletedTodo(
            $headingElement,
            $editButton,
            $doneButton,
            $completdBadgeElement
        );
    }

    $deleteButton.addEventListener("click", () => deleteTodoHandler(todo.id));

    $editButton.addEventListener("click", () =>
        editTodoHandler(
            $editButton,
            $inputElement,
            $headingElement,
            $paragraphElement,
            $cancelButton,
            $deleteButton,
            todo
        )
    );

    $cancelButton.addEventListener("click", () =>
        cancelEditingTodoHandler(
            $cancelButton,
            $inputElement,
            $headingElement,
            $paragraphElement,
            $editButton,
            $deleteButton,
            todo
        )
    );

    $doneButton.addEventListener("click", (e) =>
        markDoneTodoHandler($inputElement, todo)
    );

    $buttonWrapper.append(
        $editButton,
        $doneButton,
        $deleteButton,
        $cancelButton,
        $completdBadgeElement
    );
    $todo.append(
        $headingElement,
        $paragraphElement,
        $inputElement,
        $buttonWrapper
    );

    return $todo;
};

const renderTodos = () => {
    $todoList.innerHTML = "";

    if (!$inputWrapper.classList.contains("hide")) {
        $todoList.appendChild($inputWrapper);
    }

    const searchedTodos = searchHandler();
    const filteredTodos = filterHandler(searchedTodos);

    const paginatedTodos = getPaginatedArray(filteredTodos);

    showBlankTaskWrapper(paginatedTodos, filterState);

    activateFilterButton(todos, filterState);
    paginatedTodos.forEach((todo) => {
        $todoList.appendChild(createTodoElement(todo));
    });
};

$addButton.addEventListener("click", addTodoHandler);
$searchInput.addEventListener("input", () => renderTodos());
$allTodoButton.addEventListener("click", () => setFilter("all"));
$incompleteTodoButton.addEventListener("click", () => setFilter("incomplete"));
$completeTodoButton.addEventListener("click", () => setFilter("complete"));
$loadMoreButton.addEventListener("click", paginationHandler);
$searchButton.addEventListener("click", toggleSearchBar);
$createButton.addEventListener("click", showInputWrapper);
$clearButton.addEventListener("click", () => clearInputField($todoInput));
$filterButtonWrapper.addEventListener("click", (e) =>
    showActiveFilterButton(e)
);
