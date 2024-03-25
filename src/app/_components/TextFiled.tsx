import { type ForwardedRef, type HTMLProps, forwardRef, useId, useMemo, useState } from "react";

interface TextFiledProps extends HTMLProps<HTMLInputElement> {
    label: string
    value: string
}

const TextFiled = forwardRef((props: TextFiledProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { label, value, onChange, required, onFocus, ...rest } = props;
 
    const Id = useId();
    const [isFocus, setIsFocus] = useState(false);

    const labelClassName = useMemo(() => {
        if (value) return "sr-only"
        else return `absolute z-10 font-extralight transition-all ease-in-out 
        ${isFocus
            ? "bottom-[100%] left-[2.4%] text-sm text-black"
            : "text-base left-[4%] bottom-[20%] text-gray-700"
        }`
    }, [value, isFocus])

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e)
        setIsFocus(true)
    }

    return (
        <div ref={ref} className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {label}
                    {required ? " *" : ""}
                </label>
                <input
                    {...rest}
                    className="p-2 border h-fit rounded-sm w-full focus:border-none focus:outline-solid focus:outline-2 border-gray-700 hover:border-black focus:outline-black"
                    id={Id}
                    onFocus={(e) => {
                        onFocus && onFocus(e);
                        setIsFocus(true) 
                    }}
                    required={required}
                    value={value}
                    onBlur={() => setIsFocus(false)}
                    onChange={handelChange}
                />
            </div>
        </div>
    )
})

TextFiled.displayName = "TextFiled";

export default TextFiled;