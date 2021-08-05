import React, { useEffect, useState } from 'react';
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
  const [slides, setSlides] = useState([]);
  useEffect(() => {
      setSlides(props.slides)
  }, [])

  return (
    <div className='slider-container'>
      <div className='navigation-wrapper'>
        <div ref={sliderRef} className='keen-slider'>
            { slides && slides.length && slides.map((slide, index) => {
              return (
                <div className='keen-slider__slide' key={index}>
                  <div className='row'>
                    <div className='col-md-6'>
                      <h1 className='title' dangerouslySetInnerHTML={{ __html: slide.title}}></h1>
                      <h3 className='subtitle'>{slide.subTitle}</h3>
                      <p className='content'>{slide.content}</p>
                    </div>
                    <div className='col-md-6'>
                      <img src={slide.image} alt='image'></img>
                    </div>
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
