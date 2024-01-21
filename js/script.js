import {
    $addButton,
    $todoInput,
    $todoList,
    $searchInput,
    $allTodoButton,
    $completeTodoButton,
    $incompleteTodoButton,
    $loadMoreButton,
    $searchButton,
    $createButton,
    $inputWrapper,
    $clearButton,
    $filterButtonWrapper,
    $blankFieldWrapper,
    $blankFieldImage,
} from "./element.js";
import {
    sanitizeInput,
    clearInputField,
    showToastMessage,
    showCompletedTodo,
    addButtonClasses,
    showCompletedTime,
    showFormattedDate,
    activateFilterButton,
    showBlankTaskWrapper,
    showActiveFilterButton,
    showEditedTitle,
    getTodos,
    getStates,
} from "./utility.js";

import {
    INCOMPLETE,
    COMPLETE,
    PAGE_LOAD_COUNT,
    INITIAL_PAGE,
    DELETE_ICON,
    EDIT_ICON,
    DONE_ICON,
    PLUS_ICON,
    ALL,
    ERROR,
    SUCCESS,
} from "./const.js";

let todos = [];

let filterState = ALL;

const pageLoadCount = PAGE_LOAD_COUNT;
let currentPage = INITIAL_PAGE;
let totalPage = INITIAL_PAGE;

let isTaskInputVisible = false;

const showInputWrapper = () => {
    isTaskInputVisible = $inputWrapper.classList.contains("hide");

    if (isTaskInputVisible) {
        $createButton.innerText = "Hide";
    } else {
        $createButton.innerHTML = `${PLUS_ICON} Create`;
    }

    $blankFieldWrapper.classList.toggle("hide");
    $inputWrapper.classList.toggle("hide");
    renderTodos();
};

const addTodoHandler = () => {
    const todoTitle = sanitizeInput($todoInput.value).trim();
    if (!todoTitle.length) {
        showToastMessage(ERROR, "You can not add a todo item without a title.");
        return;
    }

    todos.unshift({
        id: new Date().getTime(),
        title: todoTitle,
        createdAt: new Date().toUTCString(),
        isEditing: false,
        isCompleted: false,
    });
    clearInputField($todoInput);

    clearInputField($searchInput);

    showToastMessage(SUCCESS, "You have successfully added a todo item");

    renderTodos();
};

const deleteTodoHandler = (todoId) => {
    todos = todos.filter((todo) => todo.id !== todoId);
    clearInputField($searchInput);

    showToastMessage(ERROR, "You have successfully deleted a todo item");
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
        showToastMessage(
            ERROR,
            "You can not update a todo without any title. Please add a title"
        );

        return;
    } else {
        editButton.innerHTML = EDIT_ICON;
        headingElement.textContent = inputElement.value;
        todo.title = inputElement.value;
        todo.isEditing = false;

        showToastMessage(SUCCESS, " You have successfully updated a todo item");
    }

    showEditedTitle(
        editButton,
        deleteButton,
        inputElement,
        cancelButton,
        paragraphElement,
        headingElement
    );

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
    showEditedTitle(
        editButton,
        deleteButton,
        inputElement,
        cancelButton,
        paragraphElement,
        headingElement
    );

    showToastMessage(ERROR, "You have canceled to update");

    editButton.innerHTML = EDIT_ICON;
    todo.isEditing = false;
};

const markDoneTodoHandler = (inputElement, todo) => {
    if (!inputElement.value.trim()) {
        showToastMessage(
            ERROR,
            "You can not make done a todo without any title"
        );
        return;
    }

    clearInputField($searchInput);

    showToastMessage(SUCCESS, "You have successfully completed a todo item");

    todo.title = sanitizeInput(inputElement.value).trim();
    todo.isCompleted = true;
    todo.completedAt = showCompletedTime(todo.createdAt);
    renderTodos();
};

const searchHandler = (searchedValue) => {
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
        currentPage = INITIAL_PAGE;
    }
    renderTodos();
};

const getPaginatedArray = (todos) => {
    const startIndex = 0;
    const endIndex = $inputWrapper.classList.contains("hide")
        ? currentPage * pageLoadCount
        : currentPage * pageLoadCount - 1;

    const pageAdjustmentCount = $inputWrapper.classList.contains("hide")
        ? INITIAL_PAGE
        : 0;

    totalPage =
        INITIAL_PAGE +
        Math.floor((todos.length - pageAdjustmentCount) / pageLoadCount);

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

    $deleteButton.innerHTML = DELETE_ICON;

    $editButton.innerHTML = EDIT_ICON;

    $doneButton.innerHTML = DONE_ICON;

    $cancelButton.innerHTML = DELETE_ICON;

    $completdBadgeElement.innerHTML = `Completed in ${todo.completedAt}`;
    $spanElement.innerText = todo.completedAt > 1 ? " days" : " day";

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

const updateLocalStorageData = (searchedValue) => {
    const state = {
        filterState,
        searchedValue,
        currentPage,
        isTaskInputVisible,
    };

    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("state", JSON.stringify(state));
};

const renderTodos = () => {
    $todoList.innerHTML = "";
    const searchedValue = $searchInput.value.toLowerCase().trim();

    if (!$inputWrapper.classList.contains("hide")) {
        $todoList.appendChild($inputWrapper);
    }

    const searchedTodos = searchHandler(searchedValue);
    const filteredTodos = filterHandler(searchedTodos);

    const paginatedTodos = getPaginatedArray(filteredTodos);

    if (!todos.length) {
        filterState = ALL;
    }

    if (!paginatedTodos.length) {
        showBlankTaskWrapper(searchedValue, filterState);
    }

    activateFilterButton(todos, filterState);

    updateLocalStorageData(searchedValue);

    paginatedTodos.forEach((todo) => {
        $todoList.appendChild(createTodoElement(todo));
    });
};

const getLocalStorageData = () => {
    const { todos: data, error: dataError } = getTodos();
    const { state, error } = getStates();

    if (dataError || error) {
        showToastMessage(
            ERROR,
            "Some error occured. Please try again after some time."
        );
        return;
    }

    if (data?.length > 0) {
        todos = [...data];
    }

    filterState = state?.filterState;
    $searchInput.value = state?.searchedValue || "";
    currentPage = state?.currentPage || currentPage;
    isTaskInputVisible = state?.isTaskInputVisible || isTaskInputVisible;

    if (state?.searchedValue.length) {
        toggleSearchBar();
    }
    if (isTaskInputVisible) {
        showInputWrapper();
        return;
    }

    renderTodos();
};

getLocalStorageData();

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
$blankFieldImage.addEventListener("click", showInputWrapper);
