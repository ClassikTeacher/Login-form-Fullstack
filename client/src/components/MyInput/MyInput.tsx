import React, { FC } from 'react'
import  '../../styles/App.css'




const MyInput: FC = (props)=>{
    return(
        <input className='myInput' {...props}/>
    )
}
export default MyInput