/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import './slider.scss';

const Slider = props => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [sliderRef, slider] = useKeenSlider({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    },
  });

  return (
    <div className="slider-container">
      <div className="navigation-wrapper">
        <div ref={sliderRef} className="keen-slider  ">
          {props.slides &&
            props.slides.length &&
            props.slides.map((slide, index) => (
              <div className="keen-slider__slide" key={index}>
                <div className="row  max-height-100 h-100">
                  {props.type && props.type === 'humanJobs' && (
                    <div className=" col-md-6 col-sm-12 image">
                      <div className="image">
                        <img src={slide.image} alt="image" />
                      </div>
                    </div>
                  )}
                  <div className="col-md-6 col-sm-12">
                    <div className="content d-flex flex-column justify-content-center h-100">
                      <h3 className="subtitle">{slide.subTitle}</h3>
                      <p className="description">{slide.content}</p>
                    </div>
                  </div>
                  {props.type && props.type === 'humanAbout' && (
                    <div className=" col-md-6 col-sm-12">
                      <div className="image">
                        <img src={slide.image} alt="image" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        {slider && (
          <>
            <ArrowLeft
              onClick={e => e.stopPropagation() || slider.prev()}
              disabled={currentSlide === 0}
            />
            <ArrowRight
              onClick={e => e.stopPropagation() || slider.next()}
              disabled={currentSlide === slider.details().size - 1}
            />
          </>
        )}
      </div>
      {slider && (
        <div className="dots">
          {[...Array(slider.details().size).keys()].map(idx => (
            <button
              key={idx}
              onClick={() => {
                slider.moveToSlideRelative(idx);
              }}
              className={`dot${currentSlide === idx ? ' active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ArrowLeft = props => {
  const disabeld = props.disabled ? ' arrow--disabled' : '';
  return (
    <div onClick={props.onClick} className={`arrow arrow--left${disabeld}`}>
      <i className="text-center fa fa-long-arrow-left" />
    </div>
  );
};

const ArrowRight = props => {
  const disabeld = props.disabled ? ' arrow--disabled' : '';
  return (
    <div onClick={props.onClick} className={`arrow arrow--right${disabeld}`}>
      <i className="text-center fa fa-long-arrow-right" />
    </div>
  );
};

export default Slider;
