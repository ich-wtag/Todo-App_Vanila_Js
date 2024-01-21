import { ALL, COMPLETE, DONE_ICON, INCOMPLETE, SUCCESS } from "./const.js";
import {
    $allTodoButton,
    $blankFieldWrapper,
    $blankTitle,
    $completeTodoButton,
    $toastElement,
    $incompleteTodoButton,
    $todoList,
    $toastSpanElement,
} from "./element.js";
export const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
};

export const clearInputField = (inputElement) => {
    inputElement.value = "";
};

export const showToastMessage = (status, message) => {
    $toastSpanElement.innerHTML = message;
    $toastElement.innerHTML = "";
    $toastElement.classList.remove("hide");
    $toastElement.classList.remove("error-message");
    $toastElement.classList.remove("success-message");

    if (status === SUCCESS) {
        $toastElement.classList.add("success-message");
        $toastElement.innerHTML = DONE_ICON;
    } else {
        $toastElement.classList.add("error-message");
    }

    $toastElement.append($toastSpanElement);

    setTimeout(() => {
        $toastElement.classList.add("hide");
    }, 1500);
};

export const showEditedTitle = (
    editButton,
    deleteButton,
    inputElement,
    cancelButton,
    paragraphElement,
    headingElement
) => {
    editButton.classList.toggle("button-secondary");
    deleteButton.classList.toggle("hide");
    inputElement.classList.toggle("hide");
    cancelButton.classList.toggle("hide");
    paragraphElement.classList.toggle("hide");
    headingElement.classList.toggle("hide");
};

export const showCompletedTodo = (
    paragraphElement,
    editButton,
    doneButton,
    completdBadgeElement
) => {
    paragraphElement.classList.add("task__title--completed");
    editButton.classList.add("hide");
    doneButton.classList.add("hide");
    completdBadgeElement.classList.remove("hide");
};

export const showCompletedTime = (createdAt) => {
    const completedTimeSpan = new Date().getTime();
    const createdTimeSpan = new Date(createdAt).getTime();

    const totalDayTime = 24 * 60 * 60;

    return Math.ceil((completedTimeSpan - createdTimeSpan) / totalDayTime);
};

export const addButtonClasses = (buttonElement) => {
    buttonElement.classList.add("button-icon", "task__button");
};

export const showFormattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
};

export const showBlankTaskWrapper = (searchedValue, filterState) => {
    if (filterState !== ALL && !searchedValue.length) {
        $blankTitle.innerText = `You don't have any ${filterState} task. Please add one.`;
    } else if (searchedValue.length > 0) {
        $blankTitle.innerText = `You don't have any task named : ${searchedValue}. Please add one.`;
    } else {
        $blankTitle.innerText = "You didn't add any task. Please add one.";
    }

    $todoList.appendChild($blankFieldWrapper);
    return;
};

export const markButtonInactive = () => {
    $allTodoButton.classList.remove("button-active");
    $incompleteTodoButton.classList.remove("button-active");
    $completeTodoButton.classList.remove("button-active");
};

export const activateFilterButton = (todos, filterState) => {
    if (!todos.length) {
        $allTodoButton.classList.add("button-inactive");
        $incompleteTodoButton.classList.add("button-inactive");
        $completeTodoButton.classList.add("button-inactive");

        markButtonInactive();
        return;
    } else if (todos.length && filterState === ALL) {
        $allTodoButton.classList.add("button-active");
    } else if (todos.length && filterState === INCOMPLETE) {
        $incompleteTodoButton.classList.add("button-active");
    } else if (todos.length && filterState === COMPLETE) {
        $completeTodoButton.classList.add("button-active");
    }
    $allTodoButton.classList.remove("button-inactive");
    $incompleteTodoButton.classList.remove("button-inactive");
    $completeTodoButton.classList.remove("button-inactive");
};

export const showActiveFilterButton = (e) => {
    markButtonInactive();

    if (e.target.tagName === "BUTTON") {
        e.target.classList.add("button-active");
    }
};

export function getTodos() {
    const payload = {
        todos: [],
        error: null,
    };
    try {
        payload.todos = JSON.parse(localStorage.getItem("todos"));
    } catch (error) {
        payload.error = error;
    } finally {
        return payload;
    }
}
export function getStates() {
    const payload = {
        state: {},
        error: null,
    };
    try {
        payload.state = JSON.parse(localStorage.getItem("state"));
    } catch (error) {
        payload.error = error;
    } finally {
        return payload;
    }
}
