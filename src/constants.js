import humanAboutImg_1 from './assets/images/human_about_slider_1.png';
import humanAboutImg_2 from './assets/images/human_about_slider_2.png';
import humanAboutImg_3 from './assets/images/human_about_slider_3.png';
import humanAboutImg_4 from './assets/images/human_about_slider_4.png';
import humanAboutImg_5 from './assets/images/human_about_slider_5.png';
import humanJobImg_1 from './assets/images/human_job_slider_1.png';
import humanJobImg_2 from './assets/images/human_job_slider_2.png';

export const PrimaryColor = {
  deepPink: "#781956",
  pink: "#BE2988",
  purple: "#320A8D",
  deepPurple: "#1F0657",
  black: "#0A060E",
  grey: "#322F38",
  deepGrey: "#1F1C24",
};

export const SecondaryColor = {
  orange: "#FCBB45",
  deepOrange: "#FB9741",
  pink: "#C00949",
  lightPink: "#FA2A75",
  blue: "#6309FF",
  purple: "#440295",
  deepPurple: "#17002E",
};

export const JobOptions = {
  captcha: "captcha",
  referral: "referral",
  questionare: "questionare",
  profile: 'profile',
};

export const HumanAbout = [
  {
    title: '',
    subTitle: "A new way to work",
    content: 'HUMAN Protocol tokenizes and automates the secure publishing of data labeling jobs, and manages the distribution of the work - and its rewards - across global workforces. The Protocol offers a new way for humans and machines to collaborate, and functions as a blockchain-based infrastructure for the creation and settlement of secure, globally accessible job markets. Within HUMAN, users complete tasks – such as a CAPTCHA puzzle – that are issued by Requesters (the individuals, organizations, or machines that want work done.) Each successfully completed task rewards HMT.',
    image: humanAboutImg_1,
  },
  {
    title: '',
    subTitle: "An infrastructure for global job markets",
    content: "HUMAN Protocol operates across multiple chains – with tasks intelligently distributed to optimize their fulfilment – to support global job markets. The Protocol automates all parts of the job cycle - from launch, to quality check, and payment.",
    image: humanAboutImg_2,
  },
  {
    title: '',
    subTitle: "Improved human-machine collaboration",
    content: "HUMAN Protocol tokenizes and automates the secure publishing of data labeling jobs, and manages the distribution of the work - and its rewards - across distributed workforces. The Protocol offers a new way for humans and machines to collaborate, and functions as a blockchain-based infrastructure for the creation and settlement of secure, globally accessible job markets.",
    image: humanAboutImg_3,
  },
  {
    title: '',
    subTitle: "Real-HUMAN connections",
    content: "Global connections – direct and secure – bring workers closer to the rewards of their work, organizations to workforces, and machines to understanding. Every transfer is a handshake, signifying work requested, work completed, and transactions made. A single job can contain thousands or millions of tasks, completed by Workers distributed across the globe.",
    image: humanAboutImg_4,
  },
  {
    title: '',
    subTitle: "Jobs and tasks",
    content: "A single job can be made up of millions of tasks. In a HUMAN-Protocol-powered application, an individual task may represent any point of human-to-machine interaction: the labeling of data, or sign-off on machine labeling (known as feedback learning). HUMAN Protocol is designed to create a more human world: disintermediated yet connected, with many viewpoints and backgrounds accounted for and represented, in which value produced is rewarded.",
    image: humanAboutImg_5,
  },
];

export const HumanJobs = [
  {
    title: `The future of <span className='highlight'>HUMAN jobs</span>`,
    subTitle: "",
    content: "hCaptcha is only the first application on which HUMAN jobs can be completed. The Protocol supports other applications - such as Intel CVAT and INCEpTION - and the potential for many more; HUMAN Protocol is simply the blockchain-based infrastructure which allows distributed parties to work together trustlessly.",
    image: humanJobImg_1,
  },
  {
    title: `The future of <span className='highlight'>HUMAN jobs</span>`,
    subTitle: "",
    content: "Many kinds of application can run on the Protocol, delivering the potential for many more jobs for Workers, and new datasets to those who need them.",
    image: humanJobImg_2,
  },
];

export const ErrorType = {
  invaidPassword: "invalidPassword",
  invalidEmail: "invalidEmail",
  invalidWalletAddress: "invalidWalletAddress",
  duplicatedEmail: "duplicatedEmail",
  duplicatedUserName: "duplicatedUserName",
  requireUserName: "requireUserName",
  requireFirstName: "requireFirstName",
  requireLastName: "requireLastName",
  requirePassword: "requirePassword",
  requireEmail: "requireEmail",
  requireWalletAddress: "requireWalletAddress",
};

export const ErrorMessage = {
  invaidPassword: "Invalid Password",
  invalidWalletAddress: "Invalid Wallet Address",
  invalidEmail: "Invalid Email",
  duplicatedEmail: "email is already used",
  requirePassword: "Password required",
  requireEmail: "Email required",
  requireUserName: "User name required",
  requireWalletAddress: "Wallet Address required",
  requireVerificationToken: 'Verification token required',
  invalidVerificationToken: 'Invalid verification token',
};

export const SignUpOpt = {
  verifyEmail: 'verifyEmail',
  register: 'register',
  linkWallet: 'linkWallet',
  complete: 'complete',
}
