import fetch from "node-fetch";
import { getTeam } from "./teams.js";

const BETEXPLORER_API = "https://rsbs-footy-83wv.vercel.app/api/fixtures"; // your Vercel endpoint

async function fetchFixtures() {
  try {
    const response = await fetch(BETEXPLORER_API);
    const data = await response.json(); // get live fixtures from BetExplorer
    return data; // should include homeTeam and awayTeam fields
  } catch (err) {
    console.error("Error fetching fixtures:", err);
    return [];
  }
}

// Build metrics for each fixture
export async function buildFixtureMetrics() {
  const fixtures = await fetchFixtures();

  return fixtures.map(f => {
    const home = getTeam(f.homeTeam);
    const away = getTeam(f.awayTeam);

    return {
      matchup: `${f.homeTeam} vs ${f.awayTeam}`,
      goalRatio: `${home.GF}/${home.GA} - ${away.GF}/${away.GA}`,
      WDL: `${home.WDL} - ${away.WDL}`,
      WDL_tables: `${home.WDL_home} - ${away.WDL_away}`
    };
  });
}

// Example: log metrics
buildFixtureMetrics().then(metrics => console.log(JSON.stringify(metrics, null, 2)));
