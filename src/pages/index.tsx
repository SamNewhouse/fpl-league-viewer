import axios from "axios";
import Page from "../presentation/5-pages/HomePage";

export async function getServerSideProps() {
  const leagueId = 266576;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/fpl?leagueId=${leagueId}`
    );

    return {
      props: {
        leagueName: res.data.leagueName,
        allTeamHistory: res.data.allTeamHistory,
      },
    };
  } catch (error) {
    console.error("FPL fetch error:", error);
    return { props: { leagueName: "", allTeamHistory: [] } };
  }
}

export default Page;
