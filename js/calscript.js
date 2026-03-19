let currentDate = new Date();
let events = [];

// Load events.json
fetch("events.json")
    .then(res => res.json())
    .then(data => {
        events = data;
        console.log(events);
        console.log(events[0].date)
        console.log(typeof events[0].date == 'object')
        renderCalendar();
    });

function renderCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    const monthYear = document.getElementById("month-year");
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleString("default", { month: "long" }) + " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    console.log(firstDay, daysInMonth)

    // Fill empty slots before first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = day;

        // Highlight today
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayDiv.classList.add("today");
        }

        // Highlight weekends
        if (date.getDay() === 0 || date.getDay() === 6) {
            dayDiv.classList.add("weekend");
        }

        // Add events
        events.forEach(event => {
            let start;
            let end;
            if (typeof event.date == 'object') {
                start = new Date(event.date[0]);
                end = new Date(event.date[1]);
            } else {
                start = new Date(event.date);
                end = new Date(event.date);
            }
            //para sa pop up ni
            event.start = start.toISOString().slice(0, 10);
            event.end = end.toISOString().slice(0, 10);
            //para sa printing sa calendar adjustan og 1 day
            start.setDate(start.getDate() - 1);

            if ((date >= start && date <= end)) {
                console.log('Milds')
                const eventDiv = document.createElement("span");
                eventDiv.classList.add("event", event.category.toLowerCase());
                eventDiv.textContent = event.title;

                eventDiv.addEventListener("click", () => showPopup(event));
                dayDiv.appendChild(eventDiv);
            }
        });

        calendar.appendChild(dayDiv);
    }
}

// Navigation
document.getElementById("prev").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById("next").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Popup
function showPopup(event) {
    document.getElementById("popup-title").textContent = event.title;
    document.getElementById("popup-dates").textContent = `From ${event.start} to ${event.end}`;
    document.getElementById("popup-category").textContent = `Category: ${event.category}`;
    document.getElementById("popup-description").textContent = event.content;

    document.getElementById("popup").classList.remove("hidden");
}

document.getElementById("close").addEventListener("click", () => {
    document.getElementById("popup").classList.add("hidden");
});
