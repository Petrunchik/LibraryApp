export const formatAuthors = (authors) => {
    if (typeof authors === "string" && authors.trim()) {
        return authors
    }

    if (!Array.isArray(authors) || authors.length === 0) {
        return "Автор не указан"
    }

    return authors
        .map((author) => {
            if (typeof author === "string") {
                return author
            }

            return [author.first_name, author.last_name]
                .filter(Boolean)
                .join(" ")
        })
        .filter(Boolean)
        .join(", ")
}

export const formatGenres = (genres) => {
    if (typeof genres === "string" && genres.trim()) {
        return genres
    }

    if (!Array.isArray(genres) || genres.length === 0) {
        return "Жанр не указан"
    }

    return genres
        .map((genre) => {
            if (typeof genre === "string") {
                return genre
            }

            return genre.name
        })
        .filter(Boolean)
        .join(", ")
}

export const formatPublisher = (publisher) => {
    if (!publisher) {
        return "—"
    }

    if (typeof publisher === "string") {
        return publisher
    }

    return publisher.name || "—"
}

export const formatAuthorLabel = (author) => {
    return [author.first_name, author.last_name].filter(Boolean).join(" ")
}
