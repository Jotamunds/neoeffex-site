/*
 * JOÃO/OS — Relógio do sistema
 *
 * Mantém a hora e a data da barra inferior atualizadas.
 */

function formatMachineDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function startClock() {
    const timeElement = document.querySelector(".taskbar__time");
    const dateElement = document.querySelector(".taskbar__date");

    if (!timeElement || !dateElement) {
        return;
    }

    function updateClock() {
        const now = new Date();

        const formattedTime = new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(now);

        const formattedDate = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
        })
            .format(now)
            .replace(" de ", " ")
            .replace(".", "")
            .toUpperCase();

        timeElement.textContent = formattedTime;
        timeElement.dateTime = now.toISOString();

        dateElement.textContent = formattedDate;
        dateElement.dateTime = formatMachineDate(now);
    }

    updateClock();
    window.setInterval(updateClock, 1000);
}
