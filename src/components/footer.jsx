import ReadMoreIcon from '../assets/icons/readmore.svg';
export const Footer = () => {
    return (
        <div id='footer' className='py-2'>
            <div className='container'>
                <p className='m-0'><img src={ReadMoreIcon} className='mr-2 ml-n1'/>Read more on HUMAN Protocol</p>
                <p className='address m-0'>4th Floor, Silverstream House 45 Fitzroy Street, Fitzrovia, London, England, W1T 6EB</p>
            </div>
        </div>
    );
}