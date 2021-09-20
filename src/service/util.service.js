/* eslint-disable camelcase */
import { sactionList, ErrorMessage } from '../constants';

export const validateIPData = ipData => {
  const { country_code, latitude, longitude } = ipData;
  if (country_code && sactionList[country_code]) {
    throw new Error(ErrorMessage.sactionListError);
  } else if (
    latitude &&
    longitude &&
    latitude < sactionList.CRIMEA.latitude.top &&
    latitude > sactionList.CRIMEA.latitude.bottom &&
    longitude < sactionList.CRIMEA.longitude.right &&
    longitude > sactionList.CRIMEA.longitude.left
  ) {
    throw new Error(ErrorMessage.sactionListError);
  }

  return ipData;
};
