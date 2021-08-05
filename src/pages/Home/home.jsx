import { useSelector, useDispatch } from "react-redux";
import { Welcome } from "./welcome";
import { Job } from "./job";
import { Subscribe } from "./subscribe";
import { IntroSection } from "./intro/intro";

const HomePage = ({ data }) => {
  const isAuthed = useSelector((state) => state.auth.isAuthed);

  return (
    <>
      <Welcome />
      {isAuthed && <Job data={data.Features} />}
      <IntroSection />
      <Subscribe />
    </>
  );
};

export default HomePage;
