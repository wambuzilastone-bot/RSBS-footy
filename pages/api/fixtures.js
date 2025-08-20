// pages/api/fixtures.js
import { getTeams } from "../../data/teams";

export default async function handler(req, res) {
  const { league, country } = req.query;

  try {
    const teams = await getTeams(country);

    if (!teams || !Object.keys(teams).length) {
      return res.status(404).json([]);
    }

    // Example: build fixtures dynamically (replace with real fixture scraping logic)
    const fixtures = Object.keys(teams).map((homeTeam, i, arr) => {
      const awayTeam = arr[(i + 1) % arr.length];
      const h = teams[homeTeam];
      const a = teams[awayTeam];

      const metrics = {
        score: `${h.gf * 10}/${h.ga * 10} - ${a.gf * 10}/${a.ga * 10}`,
        wdl_ratio: `${h.wdl} - ${a.wdl}`,
        home_away_wdl: `${h.home_wdl} - ${a.home_wdl}`,
      };

      return {
        home: homeTeam,
        away: awayTeam,
        metrics,
      };
    });

    res.status(200).json({ [league]: fixtures });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
}
