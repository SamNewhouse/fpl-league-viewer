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
    <BaseLayout>
      <div className="flex flex-col justify-center max-h-svh items-center">
        <div className="w-full max-w-7xl h-svh py-3 sm:px-2 md:px-6">
          <h1 className="text-3xl mb-3">
            {leagueName ? leagueName : "League Name"}
          </h1>
          <FplChart allTeamHistory={allTeamHistory} />
        </div>
      </div>
    </BaseLayout>
  );
};

export default HomePage;
