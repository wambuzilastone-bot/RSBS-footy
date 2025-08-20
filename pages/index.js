import { useEffect, useState } from "react";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [fixtures, setFixtures] = useState([]);

  // Fetch countries on load
  useEffect(() => {
    fetch("/api/countries")
      .then(res => res.json())
      .then(data => setCountries(Object.keys(data)))
      .catch(err => console.error("Countries fetch error:", err));
  }, []);

  // Fetch leagues when country is selected
  useEffect(() => {
    if (!selectedCountry) return;
    fetch(`/api/leagues?country=${encodeURIComponent(selectedCountry)}`)
      .then(res => res.json())
      .then(data => setLeagues(data))
      .catch(err => console.error("Leagues fetch error:", err));
  }, [selectedCountry]);

  // Fetch fixtures when league is selected
  useEffect(() => {
    if (!selectedLeague) return;
    fetch(`/api/fixtures?league=${encodeURIComponent(selectedLeague)}`)
      .then(res => res.json())
      .then(data => setFixtures(data))
      .catch(err => console.error("Fixtures fetch error:", err));
  }, [selectedLeague]);

  return (
    <div style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1># RSBS Footy Viewer</h1>

      {/* Countries */}
      <h2>## Countries A-Z</h2>
      <select
        value={selectedCountry}
        onChange={e => {
          setSelectedCountry(e.target.value);
          setSelectedLeague("");
          setFixtures([]);
        }}
      >
        <option value="">Select Country</option>
        {countries.map(country => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {/* Leagues */}
      {leagues.length > 0 && (
        <>
          <h2>## Leagues</h2>
          <select
            value={selectedLeague}
            onChange={e => setSelectedLeague(e.target.value)}
          >
            <option value="">Select League</option>
            {leagues.map(league => (
              <option key={league} value={league}>
                {league}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Fixtures & Metrics */}
      {fixtures.length > 0 && (
        <>
          <h2>## Fixtures & Metrics</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Home</th>
                <th>Away</th>
                <th>Score (GF/GA)</th>
                <th>WDL Ratio</th>
                <th>Home/Away WDL</th>
              </tr>
            </thead>
            <tbody>
              {fixtures.map((f, idx) => (
                <tr key={idx}>
                  <td>{f.home}</td>
                  <td>{f.away}</td>
                  <td>{f.metrics.score}</td>
                  <td>{f.metrics.wdl_ratio}</td>
                  <td>{f.metrics.home_away_wdl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
