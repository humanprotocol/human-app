import { Welcome } from './welcome';
import { Job } from './job';
import { Subscribe } from './subscribe';
const Home = ({ data }) => {
    return(
        <>
        <Welcome data={data.Header} />
        <Job data={data.Features} />
        <Subscribe data={data.Contact} />
        </>
    )
}

export default Home;