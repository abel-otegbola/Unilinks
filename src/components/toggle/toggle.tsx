'use client'
import { type ButtonHTMLAttributes, useState } from "react";

interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    disabled?: boolean;
    checkedValue?: boolean;
    label?: string;
    name?: string;
    error?: string | undefined;
    size?: number | undefined;
    onValueChange: (aug0: boolean) => void;
}

export default function Toggle({ className, disabled, label, onValueChange, checkedValue, name, size, ...props }: ToggleProps) {
    const [focus, setFocus] = useState(false)
    const [checked, setChecked] = useState(checkedValue)

    return (
        <div className="flex items-center w-fit gap-1">
            <button 
                className={` rounded-[30px] flex just0fy-center items-center p-[2px]
                    ${disabled ? "opacity-[0.25]" : ""} 
                    ${checked ? "text-white bg-[#C22026]" : "bg-gray-500/[0.5]"} 
                    ${focus ? "outline outline-[#C22026]/[0.2] outline-offset" : ""} 
                    ${className} 
                `}
                style={{ height: size || "20px", width: (size || 20)+20 }}
                onClick={() => {setChecked(!checked); setFocus(true); onValueChange(!checked)}}
                onBlur={() => setFocus(false)}
                {...props}
            >
                <span style={{ height: (size || 20)-4, width: (size || 20)-4 }} className={`bg-white dark:bg-dark duration-300 rounded-full relative ${checked ? "left-[20px]" : "left-0"}`}></span>
            </button>

            { label ? <label htmlFor={name} >{label}</label> : "" }
        </div>
    )
}