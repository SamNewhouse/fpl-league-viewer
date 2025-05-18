import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

interface StandingsTeam {
  entry: number;
  entry_name: string;
}

interface HistoryEntry {
  event: number;
  total_points: number;
}

interface TeamHistory {
  entryId: number;
  teamName: string;
  history: HistoryEntry[];
}

interface LeagueDataResponse {
  leagueName: string;
  allTeamHistory: TeamHistory[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { leagueId } = req.query;

  if (!leagueId || Array.isArray(leagueId)) {
    return res.status(400).json({ error: "Invalid or missing leagueId" });
  }

  try {
    const leagueUrl = `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`;
    const { data } = await axios.get(leagueUrl);
    const teams: StandingsTeam[] = data.standings?.results || [];
    const leagueName = data.league?.name || "Unknown League"; // Extract league name from the response

    const allTeamHistory: TeamHistory[] = await Promise.all(
      teams.map(async (team) => {
        try {
          const { data } = await axios.get(
            `https://fantasy.premierleague.com/api/entry/${team.entry}/history/`
          );

          const history: HistoryEntry[] = Array.isArray(data.current)
            ? data.current.map((gw: any) => ({
                event: gw.event,
                total_points: gw.total_points,
              }))
            : [];

          return {
            entryId: team.entry,
            teamName: team.entry_name,
            history,
          };
        } catch (err) {
          console.error(`Failed to fetch history for ${team.entry_name}`, err);
          return {
            entryId: team.entry,
            teamName: team.entry_name,
            history: [],
          };
        }
      })
    );

    // Return both league name and team history
    const responseData: LeagueDataResponse = {
      leagueName,
      allTeamHistory,
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Error fetching league data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
