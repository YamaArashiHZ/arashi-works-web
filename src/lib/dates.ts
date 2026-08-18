const dateTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Shanghai',
    hourCycle: 'h23',
});

export function formatDateTime(date: Date) {
    const parts = Object.fromEntries(
        dateTimeFormatter
            .formatToParts(date)
            .map(({ type, value }) => [type, value]),
    );

    return `${parts.year}/${parts.month}/${parts.day} ${parts.hour}:${parts.minute}`;
}

const yearMonthFormatter = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "numeric",
    timeZone: "Asia/Shanghai",
});

export function getYearMonth(date: Date) {
    const parts = Object.fromEntries(
        yearMonthFormatter
            .formatToParts(date)
            .map(({ type, value }) => [type, value]),
    );

    return {
        year: parts.year,
        month: parts.month,
    };
}