// data/teams.js
import axios from "axios";

const BASE_URL = "https://rsbs-footy.vercel.app"; // your deployed Vercel URL

export async function getTeams(country) {
  try {
    const res = await axios.get(`${BASE_URL}/api/teams?country=${encodeURIComponent(country)}`);
    return res.data; // this is live data from your scraper
  } catch (err) {
    console.error("Error fetching teams for country:", country, err);
    return {};
  }
}
