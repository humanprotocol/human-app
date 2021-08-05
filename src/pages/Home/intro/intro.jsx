import Slider from '../../../components/slider/slider';
import './intro.css';
import { HumanAbout, HumanJobs } from '../../../constants';
export const IntroSection = (props) => {
    const slides = [
        'Slider 1',
        'Slider 2',
        'Slider 3',
        'Slider 4',
    ]
    return (
        <div id='intro'>
            <div className='human-about'>
                <div className='section'>
                    <div className='container'>
                        <Slider slides={HumanAbout} type='humanAbout'></Slider>
                    </div>
                </div>
            </div>
            <div className='human-jobs'>
                <div className='section'>
                    <div className='container'>
                        <Slider slides={HumanJobs} type='humanJobs'></Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}