import { useSelector, useDispatch } from "react-redux";
import { Welcome } from "./welcome";
import { Job } from "./job";
import { Subscribe } from "./subscribe";

const HomePage = ({ data }) => {
  const isAuthed = useSelector((state) => state.auth.isAuthed);

  return (
    <>
      <Welcome data={data.Header} />
      {isAuthed && <Job data={data.Features} />}
      <Subscribe data={data.Contact} />
    </>
  );
};

export default HomePage;
