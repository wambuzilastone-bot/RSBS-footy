import leagues from "../../data/leagues.json";

export default function handler(req, res) {
  const { country } = req.query;
  if (!country || !leagues[country]) {
    return res.status(404).json([]);
  }
  res.status(200).json(leagues[country]);
}
