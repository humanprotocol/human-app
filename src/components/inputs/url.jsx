export const URLInput = ({ className }) => {
    return(
        <div className={`row ${className}`}>
            <div className='input-group'>
                <input className='form-control py-2 border-right-0 border' type='url'/>
                <span className='input-group-append'>
                    <button className='btn border border-0' type='button'>
                        <i className='material-icons'>refresh</i>
                    </button>
                </span>
            </div>
        </div>
    )
}