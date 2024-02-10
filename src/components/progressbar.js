import React, {useState, useEffect} from 'react'
import "./progressbar.css"

export const Progressbar = () => {
    const [filled, setFilled] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    useEffect(() => {
        if (filled < 100 && isRunning) {
            setTimeout(() => setFilled(prev => prev += 2), 50)

        }
    },[filled, isRunning])
    return (
        <div>
            <div className="progressbar">
                <div style={{
                    height: "100%",
                    width: `${filled}%`,
                    backgroundColor: "#fff",
                    transition:"width 0.5s"
                }}></div>
                <span className="progressPercent">{ filled }%</span>
            </div>
        </div>
    )
}