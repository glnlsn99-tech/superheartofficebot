const { Telegraf, Markup } = require('telegraf');
const { getWarNews, getCampaign, getMajorOrders, getPlanets } = require('./hd2-api');
const { loadouts } = require('./loadouts');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const MINIAPP_URL = process.env.MINIAPP_URL;

function webAppKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.webApp('Apri Mini App', MINIAPP_URL)],
    [Markup.button.callback('News Super Terra', 'news')],
    [Markup.button.callback('Loadout', 'loadout')],
    [Markup.button.callback('Pianeti', 'planet')]
  ]);
}

bot.start(async (ctx) => {
  await ctx.reply('Companion di Super Terra pronto.', webAppKeyboard());
});

bot.command('companion', async (ctx) => {
  await ctx.reply('Apri il companion.', webAppKeyboard());
});

bot.command('news', async (ctx) => {
  try {
    const mo = await getMajorOrders();
    const camp = await getCampaign();
    const news = await getWarNews();

    const title = mo?.[0]?.setting?.overrideTitle || mo?.[0]?.setting?.taskBriefing || 'Ordine maggiore non disponibile';
    const briefing = mo?.[0]?.setting?.overrideBrief || 'Nessun briefing disponibile';
    const fronts = Array.isArray(camp) ? camp.slice(0, 3).map(p => `- ${p.name || `Pianeta ${p.planetIndex}`}`).join('\n') : '- Nessun fronte attivo';
    const dispatches = Array.isArray(news) ? news.slice(-2).map(n => `- ${String(n.message || '').replace(/\s+/g, ' ').slice(0, 120)}`).join('\n') : '- Nessun dispaccio';

    await ctx.reply(`Bollettino di Super Terra\n\nOrdine Maggiore:\n${title}\n${briefing}\n\nFronti:\n${fronts}\n\nDispacci:\n${dispatches}`);
  } catch {
    await ctx.reply('Impossibile leggere le news in questo momento.');
  }
});

bot.command('loadout', async (ctx) => {
  const text = loadouts.map(l =>
    `${l.nome} (${l.difficolta})\nPrimaria: ${l.primaria}\nSecondaria: ${l.secondaria}\nArmatura: ${l.armatura}\n`
  ).join('\n');

  await ctx.reply(`Loadout disponibili:\n\n${text.slice(0, 3500)}`);
});

bot.command('planet', async (ctx) => {
  try {
    const planets = await getPlanets();
    const list = Array.isArray(planets) ? planets.slice(0, 5) : [];
    const text = list.map(p => `- ${p.name || `Pianeta ${p.planetIndex}`}`).join('\n');
    await ctx.reply(`Pianeti attivi:\n${text || '- Nessun pianeta trovato'}`);
  } catch {
    await ctx.reply('Errore durante la ricerca pianeti.');
  }
});

bot.on('message', async (ctx, next) => {
  const data = ctx.message?.web_app_data?.data;
  if (!data) return next();

  try {
    const payload = JSON.parse(data);

    if (payload.type === 'profile_save') {
      await ctx.reply(`Profilo salvato.\nRuolo: ${payload.profile.role}\nFazione: ${payload.profile.faction}`);
    } else if (payload.type === 'loadout_selected') {
      await ctx.reply(`Loadout ricevuto: ${payload.loadout.nome}`);
    } else if (payload.type === 'profile_summary') {
      await ctx.reply(`Riepilogo ricevuto.\nBuild suggerita: ${payload.suggestedLoadout.nome}`);
    } else {
      await ctx.reply('Dati ricevuti dalla Mini App.');
    }
  } catch {
    await ctx.reply('Formato dati non valido.');
  }
});

bot.launch();
