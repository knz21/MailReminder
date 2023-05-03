const slackBotToken = PropertiesService.getScriptProperties().getProperty('slack_bot_token')
const channelId = PropertiesService.getScriptProperties().getProperty('slack_channel_id') || ''

const remind = () => {
    sendMessage(channelId, getMessage())
}

const getMessage = (): string => {
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
            const datetime = Utilities.formatDate(firstMessage.getDate(), 'Asia/Tokyo', 'YYYY/MM/dd HH:mm:ss')
            return `${datetime} ${firstMessage.getFrom()}: ${thread.getFirstMessageSubject()}`
        })
        .join('\n')
}

const sendMessage = (channelId: string, message: string) => {
    const formData = {
        token: slackBotToken,
        channel: channelId,
        text: message
    }
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: 'post',
        payload: formData,
        muteHttpExceptions: true
    }
    UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', options)
}