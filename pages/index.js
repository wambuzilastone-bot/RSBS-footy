import { useEffect, useState } from "react";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);

  useEffect(() => {
    fetch("/api/countries")
      .then(res => res.json())
      .then(data => setCountries(data));
  }, []);

  const loadLeagues = (country) => {
    setSelectedCountry(country);
    fetch(`/api/leagues?country=${country}`)
      .then(res => res.json())
      .then(data => setLeagues(data));
  };

  const loadFixtures = (league) => {
    setSelectedLeague(league);
    fetch(`/api/fixtures?league=${league}`)
      .then(res => res.json())
      .then(data => setFixtures(data));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>BetExplorer RSBS Scraper</h1>

      <h2>Countries A-Z</h2>
      <ul>
        {countries.map((c) => (
          <li key={c}>
            <button onClick={() => loadLeagues(c)}>{c}</button>
          </li>
        ))}
      </ul>

      {selectedCountry && (
        <>
          <h2>Leagues in {selectedCountry}</h2>
          <ul>
            {leagues.map((l) => (
              <li key={l}>
                <button onClick={() => loadFixtures(l)}>{l}</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedLeague && (
        <>
          <h2>Fixtures & Metrics for {selectedLeague}</h2>
          <ul>
            {fixtures.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
