import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { country } = req.query;
  if (!country) return res.status(400).json({ error: "Missing country" });

  try {
    const url = `https://www.betexplorer.com/soccer/${country.toLowerCase()}/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let leagues = [];
    $("a.league-link").each((i, el) => {
      const league = $(el).text().trim();
      if (league) leagues.push(league);
    });

    res.status(200).json(leagues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leagues" });
  }
}
