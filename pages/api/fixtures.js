import axios from "axios";
import * as cheerio from "cheerio";

function generateMetric() {
  // Random example metrics
  const rsbs = `${Math.floor(Math.random()*20)+1}/${Math.floor(Math.random()*20)+1} - ${Math.floor(Math.random()*20)+1}/${Math.floor(Math.random()*20)+1}`;
  const wdl = `${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)+1} - ${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)+1}`;
  const homeAway = `${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)+1} - ${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)+1}`;
  return { rsbs, wdl, homeAway };
}

export default async function handler(req, res) {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "Missing league" });

  try {
    const url = `https://www.betexplorer.com/soccer/${league.toLowerCase()}/fixtures/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let fixtures = [];
    $("table.sportName tr").each((i, el) => {
      const matchText = $(el).find("td").map((i, td) => $(td).text().trim()).get().join(" vs ");
      if (matchText) {
        const { rsbs, wdl, homeAway } = generateMetric();
        fixtures.push(`${matchText} | ${rsbs} (GF/GA) | ${wdl} (WDL) | ${homeAway} (Home/Away WDL)`);
      }
    });

    res.status(200).json(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
}
