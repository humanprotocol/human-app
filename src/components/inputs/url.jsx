export const URLInput = ({ className, value, onChange, name }) => {
    return(
        <div className={className}>
            <div className='input-group'>
                <input className='form-control py-2' type='url' value={value} onChange={onChange} name={name}/>
                <div className='input-group-append' onClick={onChange} name={name}>
                    <button className='btn' type='button'>
                        <i className='material-icons'>refresh</i>
                    </button>
                </div>
            </div>
        </div>
    )
}