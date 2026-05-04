export const displayPhone = (phone) => {
    // 8 926 270 25 14
    return phone[0] + ' (' + phone.substr(1, 3) + ') ' + phone.substr(4, 3) + ' ' + phone.substr(7, 2) + ' ' + phone.substr(9, 2)
}