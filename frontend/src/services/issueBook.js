export const issueBook = async (loanData) => {
    return ApiClient.post('/loans', {
        user_id: loanData.readerId,
        book_copy_id: loanData.bookCopyId,
        days: loanData.days,
    })
}