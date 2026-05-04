// "22 апреля 2026"
export const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

// "22.04.2026"
export const formatDateShort = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
}

// "22.04.2026, 00:00:00"
export const formatDateWithTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU')
}