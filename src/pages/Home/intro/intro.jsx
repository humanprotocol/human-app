import Slider from '../../../components/slider/slider';
import './intro.css';
import { HumanAbout, HumanJobs } from '../../../constants';
export const IntroSection = (props) => {
    return (
        <div id='intro'>
            <div className='human-about'>
                <div className='section'>
                    <div className='container h-100'>
                        <Slider slides={HumanAbout} type='humanAbout'></Slider>
                    </div>
                </div>
            </div>
            <div className='human-jobs'>
                <div className='section'>
                    <div className='container h-100'>
                        <Slider slides={HumanJobs} type='humanJobs'></Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}