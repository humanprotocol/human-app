import React from 'react';
import Slider from '../../../components/slider/slider';
import './intro.scss';
import { HumanAbout, HumanJobs } from '../../../utils/constants';

export const IntroSection = () => (
  <div id="intro">
    <div className="human-about">
      <div className="section">
        <div className="container">
          <h1 className="title text-center">
            What is <span className="highlight">HUMAN ?</span>
          </h1>
          <Slider slides={HumanAbout} type="humanAbout" />
        </div>
      </div>
    </div>
    <div className="human-jobs">
      <div className="section">
        <div className="container">
          <h1 className="title text-center">
            The future of <span className="highlight">HUMAN Jobs</span>
          </h1>
          <Slider slides={HumanJobs} type="humanJobs" />
        </div>
      </div>
    </div>
  </div>
);
