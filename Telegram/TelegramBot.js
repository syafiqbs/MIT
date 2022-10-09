const { Telegraf } = require('telegraf');

const TOKEN = "5763164449:AAHB43Fk345AAqNLKV3lVyZkLUS8oqqcGq8"

const bot = new Telegraf(TOKEN, { polling: true})

bot.start((ctx) => {
    console.log(ctx.message.text)
    console.log("Telegram Id: " + ctx.message.chat.id)

    var message = "Hello from TelegramBot! 🚀\n\n\nBot Command Options:"
    ctx.reply(message, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Track a wallet", callback_data: "track"}
                ], [
                    { text: "View All tracked Wallet Addresses", callback_data: "view"}
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })

})

bot.action('track', (ctx, next) => {
    ctx.reply("Please Enter Wallet Address:")
    next(ctx)
})

bot.on('text', ctx => {
    let walletAddress = ctx.message.text
    console.log("Wallet Address: " + walletAddress)

    ctx.reply("You have entered: " + walletAddress + " to track")
})

bot.command('quit', async (ctx) => {
    // Explicit usage
    await ctx.telegram.leaveChat(ctx.message.chat.id);

    // Using context shortcut
    await ctx.leaveChat();
});

function validateWalletAddress(address){
    if (address.length == 44){
        return true
    } else {
        return false
    }
}

bot.launch()

