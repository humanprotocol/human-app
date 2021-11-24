import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import PropTypes from 'prop-types';
import 'keen-slider/keen-slider.min.css';
import './index.scss';

const Slider = ({ slides, type }) => {
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
          {slides &&
            slides.length &&
            slides.map((slide) => (
              <div className="keen-slider__slide">
                <div className="row  max-height-100 h-100">
                  {type && type === 'humanJobs' && (
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
                  {type && type === 'humanAbout' && (
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
        <div className="dots">
          {[...Array(slider.details().size).keys()].map((idx) => (
            // eslint-disable-next-line react/button-has-type
            <button
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
Slider.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      subTitle: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ).isRequired,
  type: PropTypes.string.isRequired,
};

const ArrowLeft = ({ disabled, onClick }) => {
  const disabeld = disabled ? ' arrow--disabled' : '';
  return (
    <div onClick={onClick} className={`arrow arrow--left${disabeld}`}>
      <i className="text-center fa fa-long-arrow-left" />
    </div>
  );
};
ArrowLeft.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ArrowRight = ({ disabled, onClick }) => {
  const disabeld = disabled ? ' arrow--disabled' : '';
  return (
    <div onClick={onClick} className={`arrow arrow--right${disabeld}`}>
      <i className="text-center fa fa-long-arrow-right" />
    </div>
  );
};
ArrowRight.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Slider;
