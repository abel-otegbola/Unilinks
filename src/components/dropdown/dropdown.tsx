'use client'
import { type ReactNode, useState } from "react";

type option = {
  id: string | number;
  icon?: ReactNode;
  title: string;
}

interface dropdownProps {
    className?: string;
    disabled?: boolean;
    label?: string;
    name?: string;
    value: string | number;
    onChange: (value: string) => void;
    error?: string | undefined;
    options?: option[];
}

export default function Dropdown({ className, disabled, label, name, options, value, onChange, error }: dropdownProps) {
    const [focus, setFocus] = useState(false)

    return (
        <div className={`relative flex flex-col gap-2 2xl:text-[16px] md:text-[14px] ${className}`}>
            <div className="flex justify-between gap-4">
                { label ? <label htmlFor={name} className={`${focus ? "text-primary" : ""}`}>{label}</label> : "" }
                { error && !focus ? <p className="px-2 text-[12px] italic text-[#C22026] backdrop-blur-sm">{error}</p> : "" }
            </div>

            <div className={`flex items-center relative rounded-[8px] bg-transparent w-full py-1 pl-1 border duration-500 z-[1] bg-white w-full p-1 px-1 duration-500 md:shadow-[0px_0px_13px_5px_#FFFFFF12_inset] shadow-[0px_0px_9.52px_3.66px_#FFFFFF12_inset] 
                ${error && !focus ? "border-[#C22026] text-red-500" : "border-gray-500/[0.2]"}
                ${focus ? "border-primary" : "border-gray-500/[0.2]"}
                ${ disabled ? "cursor-not-allowed opacity-[0.25]" : "cursor-pointer" }
                ${ className }
            `}>
                <span className="text-[16px]">
                  {/* <Map /> */}
                </span>
                <select
                    className={`p-3 py-[11px] w-[97%] text-[12px] outline-none bg-transparent cursor-pointer
                        ${className} 
                        ${disabled ? "opacity-[0.25]" : ""}
                    `}
                    name={name}
                    value={value}
                    id={name}
                    onClick={() => setFocus(!focus)}
                    onBlur={() => setFocus(false)}
                    onChange={(e) => {onChange(e.target.value)}}
                >
                  {
                    options?.map(option => (
                      <option className="p-4 h-[40px] bg-white" key={option.id} value={option.title}>{option.title}</option>
                    ))
                  }
                </select>
            </div>
        </div>
    )
}