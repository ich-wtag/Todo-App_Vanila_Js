import {
    $allTodoButton,
    $completeTodoButton,
    $errorMessageElement,
    $incompleteTodoButton,
} from "./element.js";
export const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
};

export const clearInputField = (inputElement) => {
    inputElement.value = "";
};

export const showErrorMessage = (message) => {
    $errorMessageElement.classList.remove("hide");
    $errorMessageElement.innerHTML = message;
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

export const activeFilterButton = () => {
    $allTodoButton.classList.remove("button-inactive");
    $incompleteTodoButton.classList.remove("button-inactive");
    $completeTodoButton.classList.remove("button-inactive");
};

export const deactiveFilterButton = () => {
    $allTodoButton.classList.add("button-inactive");
    $incompleteTodoButton.classList.add("button-inactive");
    $completeTodoButton.classList.add("button-inactive");
};
