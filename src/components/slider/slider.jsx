import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import './slider.css';

const Slider = (props) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [sliderRef, slider] = useKeenSlider({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    },
  });

  return (
    <div className='slider-container h-100'>
      <div className='navigation-wrapper h-100'>
        <div ref={sliderRef} className='keen-slider h-100'>
            { props.slides && props.slides.length && props.slides.map((slide, index) => {
              return (
                <div className='keen-slider__slide' key={index}>
                  <div className='row h-100'>
                    { props.type && props.type === 'humanJobs' && 
                    <div className='col-md-6 image h-100'>
                      <div className='image'>
                        <img src={slide.image} alt='image'></img>
                      </div>
                    </div>
                    }
                    <div className='col-md-6'>
                      <div className='content'>
                        <h1 className='title mb-4' dangerouslySetInnerHTML={{ __html: slide.title}}></h1>
                        <h3 className='subtitle mb-4'>{slide.subTitle}</h3>
                        <p className=''>{slide.content}</p>
                      </div>
                    </div>
                    { props.type && props.type === 'humanAbout' && 
                    <div className='col-md-6 h-100'>
                      <div className='image'>
                        <img src={slide.image} alt='image'></img>
                      </div>
                    </div>
                    }
                  </div>
                </div>
              )
            }) }
        </div>
        {slider && (
          <>
            <ArrowLeft
              onClick={(e) => e.stopPropagation() || slider.prev()}
              disabled={currentSlide === 0}
            />
            <ArrowRight
              onClick={(e) => e.stopPropagation() || slider.next()}
              disabled={currentSlide === slider.details().size - 1}
            />
          </>
        )}
      </div>
      {slider && (
        <div className='dots'>
          {[...Array(slider.details().size).keys()].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  slider.moveToSlideRelative(idx);
                }}
                className={'dot' + (currentSlide === idx ? ' active' : '')}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const ArrowLeft = (props) => {
  const disabeld = props.disabled ? ' arrow--disabled' : '';
  return (
    <div
      onClick={props.onClick}
      className={'arrow arrow--left' + disabeld}
    ><i className='text-center fa fa-long-arrow-left'></i></div>
  );
}

const ArrowRight = (props) => {
  const disabeld = props.disabled ? ' arrow--disabled' : '';
  return (
    <div
      onClick={props.onClick}
      className={'arrow arrow--right' + disabeld}
    ><i className='text-center fa fa-long-arrow-right'></i></div>
  );
}

export default Slider;
