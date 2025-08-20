import teams from "./teams.json";

// Helper: get GF/GA ratio multiplied by 10
function getGoalRatio(team) {
  return `${teams[team].GF}/${teams[team].GA}`;
}

// Get metrics for two teams
export function getMatchupMetric(home, away) {
  return {
    matchup: `${home} vs ${away}`,
    goalRatio: `${getGoalRatio(home)} - ${getGoalRatio(away)}`,
    WDL: `${teams[home].WDL} - ${teams[away].WDL}`,
    WDL_tables: `${teams[home].WDL_home} - ${teams[away].WDL_away}`
  };
}
