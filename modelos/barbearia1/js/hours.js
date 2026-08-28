(() => {
    const config = window.BARBERSHOP_CONFIG;
    const status = document.getElementById("openStatus");
    const dot = document.getElementById("statusDot");

    if (!config?.contact?.weeklyHours || !status || !dot) {
        return;
    }

    const nowInSaoPaulo = () => {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Sao_Paulo",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).formatToParts(new Date());

        const read = (type) => parts.find((part) => part.type === type)?.value;
        const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

        return {
            day: days[read("weekday")],
            hour: Number(read("hour")),
            minute: Number(read("minute"))
        };
    };

    const updateOpenStatus = () => {
        const current = nowInSaoPaulo();
        const hours = config.contact.weeklyHours[current.day];
        const decimalHour = current.hour + current.minute / 60;
        const isOpen = Boolean(hours && decimalHour >= hours[0] && decimalHour < hours[1]);

        status.textContent = isOpen ? "Aberto agora" : "Fechado agora";
        dot.classList.toggle("is-closed", !isOpen);
    };

    updateOpenStatus();
    window.setInterval(updateOpenStatus, 60000);
})();
