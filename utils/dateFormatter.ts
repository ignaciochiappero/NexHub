// app/utils/dateFormatter.ts

export const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });