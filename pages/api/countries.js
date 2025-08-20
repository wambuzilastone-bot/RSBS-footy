import countries from "../../countries.json";

export default function handler(req, res) {
  res.status(200).json(countries);
}
