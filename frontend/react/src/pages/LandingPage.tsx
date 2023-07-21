import Landing from "../components/home/Landing";
import {useSelector} from "react-redux";
import {RootState} from "../store/Store.tsx";

const LandingPage = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return <Landing isAuth={isAuth} />;
};

export default LandingPage;
