import { initDialog } from "./dialog.js";
import { eventTimeToDate } from "./event.js";

const eventDateFormater = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

const eventTimeFormater = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric'
});

export function initEventDetailsDialog() {
    const dialog = initDialog('event-details');

    const deleteButtonElement = dialog.dialogElement.querySelector('[data-event-details-delete-button]');

    const editButtonElement = dialog.dialogElement.querySelector('[data-event-details-edit-button]');

    let currentEvent = null;

    document.addEventListener('event-click', (event) => {
        currentEvent = event.detail.event;

        fillEventDetailsDialog(dialog.dialogElement, event.detail.event);

        dialog.open();
    });

    deleteButtonElement.addEventListener('click', () => {
        dialog
        .close()
        .then(() => {
            deleteButtonElement.dispatchEvent(
                new CustomEvent(
                    'event-delete-request',
                    {
                        detail: {
                            event: currentEvent
                        },
                        bubbles: true
                    }
                )
            );
        });
    });

    editButtonElement.addEventListener('click', () => {
        dialog
        .close()
        .then(() => {
            editButtonElement.dispatchEvent(
                new CustomEvent(
                    'event-edit-request',
                    {
                        detail: {
                            event: currentEvent
                        },
                        bubbles: true
                    }
                )
            );
        });
    });
}

function fillEventDetailsDialog(parent, event) {
    const eventDetailsElement = parent.querySelector('[data-event-details]');
    const eventDetailsTitleElement = eventDetailsElement.querySelector('[data-event-details-title]');
    const eventDetailsDescriptionElement = eventDetailsElement.querySelector('[data-event-details-description]');
    const eventDetailsDateElement = eventDetailsElement.querySelector('[data-event-details-date]');
    const eventDetailsStartTimeElement = eventDetailsElement.querySelector('[data-event-details-start-time]');
    const eventDetailsEndTimeElement = eventDetailsElement.querySelector('[data-event-details-end-time]');

    eventDetailsTitleElement.textContent = event.title;
    eventDetailsDateElement.textContent = eventDateFormater.format(event.date);
    eventDetailsStartTimeElement.textContent = eventTimeFormater.format(eventTimeToDate(event, event.startTime));
    eventDetailsEndTimeElement.textContent = eventTimeFormater.format(eventTimeToDate(event, event.endTime));

    if (event?.description) {
        eventDetailsDescriptionElement.style.display = 'flex';
        eventDetailsDescriptionElement.value = event.description;
    } else {
        eventDetailsDescriptionElement.style.display = 'none';
        eventDetailsDescriptionElement.value = '';
    }

    eventDetailsElement.style.setProperty('--event-color', event.color);
}
