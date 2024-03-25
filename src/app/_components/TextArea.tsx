import { type HTMLProps, useId, useMemo, useState } from "react";

interface TextAreaProps extends HTMLProps<HTMLTextAreaElement> {
    label: string
    value: string
}

const TextArea = (props: TextAreaProps) => {
    const {onChange, label, value, ...rest} = props

    const Id = useId();
    const [isFocus, setIsFocus] = useState(false);

    const labelClassName = useMemo(() => {
        if (value) return "sr-only"
        else return `absolute z-10 font-extralight transition-all ease-in-out 
        ${isFocus
                ? "bottom-[100%] left-[2.4%] text-sm text-black"
                : "text-base left-[4%] bottom-[70%] text-gray-700"
            }`
    }, [value, isFocus])

    const handelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange && onChange(e)
        setIsFocus(true)
    }

    return (
        <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {label}
                </label>
                <textarea
                    {...rest}
                    className="p-2 border h-40 resize-none rounded-sm w-full focus:border-none focus:outline-solid focus:outline-2 border-gray-700 hover:border-black focus:outline-black"
                    id={Id}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={handelChange}
                />
            </div>
        </div>
    )
}

export default TextArea;