import countries from "../../data/countries.json";

export default function handler(req, res) {
  res.status(200).json(countries);
}
