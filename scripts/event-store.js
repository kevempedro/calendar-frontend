import { isTheSameDay } from "./date.js";

export function initEventStore() {
    document.addEventListener('event-create', (event) => {
        const createdEvent = event.detail.event;
        const events = getEventsFromLocalStorage();

        events.push(createdEvent);

        saveEventsIntoLocalStorage(events);

        document.dispatchEvent(
            new CustomEvent(
                'events-change',
                {
                    bubbles: true
                }
            )
        );
    });

    document.addEventListener('event-delete', (event) => {
        const deletedEvent = event.detail.event;
        const events = getEventsFromLocalStorage().filter((event) => {
            return event.id !== deletedEvent.id;
        });

        saveEventsIntoLocalStorage(events);

        document.dispatchEvent(
            new CustomEvent(
                'events-change',
                {
                    bubbles: true
                }
            )
        );
    });

    document.addEventListener('event-edit', (event) => {
        const editedEvent = event.detail.event;
        const events = getEventsFromLocalStorage().map((event) => {
            return event.id === editedEvent.id ? editedEvent : event;
        });

        saveEventsIntoLocalStorage(events);

        document.dispatchEvent(
            new CustomEvent(
                'events-change',
                {
                    bubbles: true
                }
            )
        );
    });

    return {
        getEventsByDate(date) {
            const events = getEventsFromLocalStorage();

            const filteredEvents = events.filter((event) => isTheSameDay(event.date, date));

            return filteredEvents;
        }
    };
}

function saveEventsIntoLocalStorage(events) {
    const safeToStringifyEvents = events.map((event) => ({
        ...event,
        date: `${event.date.toISOString().replace('Z', '').split('T')[0]}T10:00:00.000`
    }));

    let stringifiedEvents;

    try {
        stringifiedEvents = JSON.stringify(safeToStringifyEvents);

        localStorage.setItem('events', stringifiedEvents);
    } catch (error) {
        console.error('Stringify events failed: ', error);
    }
}

function getEventsFromLocalStorage() {
    const localStorageEvents = localStorage.getItem('events');

    if (localStorageEvents === null) {
        return [];
    }

    let parsedEvents;

    try {
        parsedEvents = JSON.parse(localStorageEvents);

        const events = parsedEvents.map((event) => ({
            ...event,
            date: new Date(event.date)
        }));

        return events;
    } catch (error) {
        console.error('Parse events failed: ', error);
        return [];
    }
}