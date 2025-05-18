export interface History {
  event: number;
  total_points: number;
  overall_rank: number;
}

export interface TeamHistory {
  entryId: number;
  teamName: string;
  history: History[];
}
