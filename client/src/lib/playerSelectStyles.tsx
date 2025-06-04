/* eslint-disable  @typescript-eslint/no-explicit-any */
export const playerSelectStyles = {
    control: (provided: any) => ({
        ...provided,
        backgroundColor: 'transparent',
        borderColor: '#d1d5db',
        color: 'white',
        fontSize: '1.25rem',
        padding: '0.125rem',
        '&:hover': {
            borderColor: '#8b5cf6'
        },
        '&:focus-within': {
            borderColor: '#8b5cf6',
            boxShadow: '0 0 0 1px #8b5cf6'
        }
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'white'
    }),
    input: (provided: any) => ({
        ...provided,
        color: 'white'
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '#1f2937'
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#374151' : '#1f2937',
        color: 'white',
        '&:active': {
            backgroundColor: '#4b5563'
        },
    })
};