import { validateEvent, generateEventId } from "./event.js";

export function initEventForm(toaster) {
    const formElement = document.querySelector('[data-event-form]');

    let mode = 'create';

    formElement.addEventListener('submit', (event) => {
        event.preventDefault();

        const formEvent = formIntoEvent(formElement);
        const validationError = validateEvent(formEvent);

        if (validationError !== null) {
            toaster.error(validationError);
            return;
        }

        if (mode === 'create') {
            formElement.dispatchEvent(
                new CustomEvent(
                    'event-create',
                    {
                        detail: {
                            event: formEvent
                        },
                        bubbles: true
                    }
                )
            );
        }

        if (mode === 'edit') {
            formElement.dispatchEvent(
                new CustomEvent(
                    'event-edit',
                    {
                        detail: {
                            event: formEvent
                        },
                        bubbles: true
                    }
                )
            );
        }
    });

    return {
        formElement,

        switchCreateMode(date, startTime, endTime) {
            mode = 'create';
            fillFormWithDate(formElement, date, startTime, endTime);
        },

        switchEditMode(event) {
            mode = 'edit';
            fillFormWithEvent(formElement, event);
        },

        reset() {
            formElement.querySelector('#id').value = null;
            formElement.reset();
        }
    };
}

function fillFormWithDate(formElement, date, startTime, endTime) {
    const dateInputElement = formElement.querySelector('#date');
    const startTimeSelectElement = formElement.querySelector('#start-time');
    const endTimeSelectElement = formElement.querySelector('#end-time');

    dateInputElement.value = date.toISOString().substr(0, 10);
    startTimeSelectElement.value = startTime;
    endTimeSelectElement.value = endTime;
}

function fillFormWithEvent(formElement, event) {
    const idInputElement = formElement.querySelector('#id');
    const titleInputElement = formElement.querySelector('#title');
    const descriptionTextAreaElement = formElement.querySelector('#description');
    const dateInputElement = formElement.querySelector('#date');
    const startTimeInputElement = formElement.querySelector('#start-time');
    const endTimeInputElement = formElement.querySelector('#end-time');
    const colorInputElement = formElement.querySelector(`[value='${event.color}']`);

    idInputElement.value = event.id;
    titleInputElement.value = event.title;
    descriptionTextAreaElement.value = event.description;
    dateInputElement.value = event.date.toISOString().substr(0, 10);
    startTimeInputElement.value = event.startTime;
    endTimeInputElement.value = event.endTime;
    colorInputElement.checked = true;
}

function formIntoEvent(formElement) {
    const formData = new FormData(formElement);

    const id = formData.get('id');
    const title = formData.get('title');
    const description = formData.get('description');
    const date = formData.get('date');
    const startTime = formData.get('start-time');
    const endTime = formData.get('end-time');
    const color = formData.get('color');

    const event = {
        id: id ? Number.parseInt(id, 10) : generateEventId(),
        title,
        description,
        date: new Date(date),
        startTime: Number.parseInt(startTime, 10),
        endTime: Number.parseInt(endTime, 10),
        color
    };

    return event;
}