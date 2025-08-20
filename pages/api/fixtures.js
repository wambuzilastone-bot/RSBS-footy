// pages/api/fixtures.js

import { getTeam } from "../../data/teams.js"; // make sure this path matches your repo
import fetch from "node-fetch";

const BETEXPLORER_URL = "https://rsbs-footy-83wv.vercel.app/api/fixtures"; // your live Vercel endpoint

export default async function handler(req, res) {
  try {
    const response = await fetch(BETEXPLORER_URL);
    const fixturesData = await response.json(); // live fixtures from BetExplorer
    const metrics = fixturesData.map(fixture => {
      const homeTeam = getTeam(fixture.homeTeam);
      const awayTeam = getTeam(fixture.awayTeam);

      return {
        matchup: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
        goalRatio: `${homeTeam.GF}/${homeTeam.GA} - ${awayTeam.GF}/${awayTeam.GA}`,
        WDL: `${homeTeam.WDL} - ${awayTeam.WDL}`,
        WDL_tables: `${homeTeam.WDL_home} - ${awayTeam.WDL_away}`
      };
    });

    res.status(200).json(metrics);
  } catch (err) {
    console.error("Error fetching fixtures:", err);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
}
