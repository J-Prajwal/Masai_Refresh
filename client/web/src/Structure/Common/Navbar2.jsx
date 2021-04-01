import React from 'react'
import { commonStyles } from "./Styles/commonStyles";

const Navbar2 = () => {
    const classes = commonStyles()
    return (
        <div className = {classes.Navbar} >
            <div>
                <img className = {classes.img} src = "data:image/png;base64,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" />
                <p className = {classes.p} >refresh</p>            
            </div>
            <div className = {classes.signout} >
                <p>Sign out</p>
            </div>
        </div>
    )
}


export {Navbar2}