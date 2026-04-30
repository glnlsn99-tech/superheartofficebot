const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const MINIAPP_URL = process.env.MINIAPP_URL;

bot.start(async (ctx) => {
  await ctx.reply(
    'Apri il companion di Super Terra.',
    Markup.inlineKeyboard([
      Markup.button.webApp('Apri Mini App', MINIAPP_URL)
    ])
  );
});

bot.command('companion', async (ctx) => {
  await ctx.reply(
    'Companion pronto.',
    Markup.inlineKeyboard([
      Markup.button.webApp('Apri Mini App', MINIAPP_URL)
    ])
  );
});

bot.on('message', async (ctx, next) => {
  const data = ctx.message?.web_app_data?.data;
  if (!data) return next();

  try {
    const payload = JSON.parse(data);

    if (payload.type === 'profile_save') {
      await ctx.reply(
        `Profilo salvato:\nRuolo: ${payload.profile.role}\nFazione: ${payload.profile.faction}`
      );
    } else if (payload.type === 'loadout_selected') {
      await ctx.reply(
        `Loadout ricevuto: ${payload.loadout.nome}\nPrimaria: ${payload.loadout.primaria}`
      );
    } else {
      await ctx.reply('Dati ricevuti dalla Mini App.');
    }
  } catch (err) {
    await ctx.reply('Errore nel parsing dei dati.');
  }
});

bot.launch();
