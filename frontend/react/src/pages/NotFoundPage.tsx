import NotFound from "../components/shared/NotFound.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../store/Store.tsx";

const NotFoundPage = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return (
    <NotFound isAuth={isAuth} />
  );
}

export default NotFoundPage;