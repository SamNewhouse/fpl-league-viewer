import { NextPage } from "next";
import { TeamHistory } from "../../lib/types";
import FplChart from "../1-atoms/FplChart";
import BaseLayout from "../4-layouts/BaseLayout";

interface HomePageProps {
  leagueName: string;
  allTeamHistory: TeamHistory[];
}

const HomePage: NextPage<HomePageProps> = ({ leagueName, allTeamHistory }) => {
  if (allTeamHistory.length === 0) {
    return (
      <BaseLayout className="flex justify-center items-center">
        <div className="text-center text-white">
          <p>Failed to fetch league data</p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout className="flex flex-col justify-center items-center min-h-screen p-4 bg-black">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl mb-6">
          {leagueName ? leagueName : "League Name"}
        </h1>
        <FplChart allTeamHistory={allTeamHistory} />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
