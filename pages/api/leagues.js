import leagues from "../../leagues.json";

export default function handler(req, res) {
  const { country } = req.query;
  if (!country) {
    return res.status(400).json({ error: "country query parameter required" });
  }
  res.status(200).json(leagues[country] || []);
}
