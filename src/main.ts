const getMessage = (): String => {
    const date = new Date()
    const today = Utilities.formatDate(date, 'Asia/Tokyo', 'YYYY/MM/dd')
    date.setDate(date.getDate() - 1)
    const yesterday = Utilities.formatDate(date, 'Asia/Tokyo', 'YYYY/MM/dd')
    return GmailApp.search(`after:${yesterday} before:${today}`)
        .sort((a, b) => {
            const firstMessageA = a.getMessages()[0]
            const firstMessageB = b.getMessages()[0]
            return firstMessageA.getDate().getTime() - firstMessageB.getDate().getTime()
        })
        .map(thread => {
            const firstMessage = thread.getMessages()[0]
            const date = Utilities.formatDate(firstMessage.getDate(), 'Asia/Tokyo', 'YYYY/MM/dd')
            return `${date} ${firstMessage.getFrom()}: ${thread.getFirstMessageSubject()}`
        })
        .join('\n')
}