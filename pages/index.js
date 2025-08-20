import { useEffect, useState } from "react";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");

  useEffect(() => {
    fetch("/api/countries")
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    fetch(`/api/leagues?country=${selectedCountry}`)
      .then(res => res.json())
      .then(setLeagues);
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedLeague) return;
    fetch(`/api/fixtures?league=${selectedLeague}`)
      .then(res => res.json())
      .then(setFixtures);
  }, [selectedLeague]);

  return (
    <div style={{ fontFamily: "monospace", padding: 20 }}>
      <h1>RSBS Footy Viewer</h1>

      <h2>Countries A-Z</h2>
      {countries.map(c => (
        <div key={c} onClick={() => setSelectedCountry(c)} style={{ cursor: "pointer" }}>
          {c}
        </div>
      ))}

      <h2>Leagues</h2>
      {leagues.map(l => (
        <div key={l} onClick={() => setSelectedLeague(l)} style={{ cursor: "pointer" }}>
          {l}
        </div>
      ))}

      <h2>Fixtures & Metrics</h2>
      {fixtures.map(f => (
        <div key={f.home + f.away}>
          <strong>{f.home} vs {f.away}</strong>
          <div>{f.metrics.score}</div>
          <div>{f.metrics.wdl_ratio}</div>
          <div>{f.metrics.home_away_wdl}</div>
        </div>
      ))}
    </div>
  );
}
