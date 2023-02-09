import React from 'react'

const FormField = ({ labelName, type, name, placeholder, value, handleChange, isSurpriseMe, handleSupriseMe }) => {
    return (
        <div>
            <div className='flex items-center gap-2 mb-2'>
                <label htmlFor={name} className='block text-sm font-medium text-grey-900'>{labelName}</label>
                {isSurpriseMe && (
                    <button type='button' onClick={handleSupriseMe} className='font-semibold bg-[#ECECF1] text-xs py-1 px-2 rounded-[5px] text-black'>Suprise me</button>
                )}

            </div>
            <input type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                required
                className='bg-grey-50 border-grey-300 text-grey-900 text-grey-300 text-sm rounded-lg focus:ring-[#4649ff] border focus:border-[#4649ff] outline-none block w-full p-3'
            />
        </div>
    )
}

export default FormField