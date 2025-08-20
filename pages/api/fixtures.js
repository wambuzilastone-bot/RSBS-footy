import fixtures from "../../data/fixtures.json";
import teams from "../../data/teams.json";

export default function handler(req, res) {
  const { league } = req.query;
  if (!league || !fixtures[league]) return res.status(404).json([]);

  // Apply metrics per fixture
  const data = fixtures[league].map(match => {
    const home = teams[match.home] || {};
    const away = teams[match.away] || {};

    const metrics = {
      score: `${(home.gf * 10 || 0)}/${(home.ga * 10 || 0)} - ${(away.gf * 10 || 0)}/${(away.ga * 10 || 0)}`,
      wdl_ratio: `${home.wdl || "000"} - ${away.wdl || "000"}`,
      home_away_wdl: `${home.homeWdl || "000"} - ${away.awayWdl || "000"}`
    };

    return {
      home: match.home,
      away: match.away,
      metrics
    };
  });

  res.status(200).json(data);
}
