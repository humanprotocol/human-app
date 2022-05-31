const { civic } = window;

// eslint-disable-next-line new-cap
const civicSip = new civic.sip({
  appId: window._env_.REACT_APP_CIVIC_APP_ID,
});

export default civicSip;
