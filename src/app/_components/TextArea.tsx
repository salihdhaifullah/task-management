import { type ChangeEventHandler, type ForwardedRef, type HTMLProps, forwardRef, useId, useMemo, useState } from "react";

interface TextAreaProps {
    label: string
    value: string
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    inputProps?: HTMLProps<HTMLTextAreaElement>
}

const TextArea = forwardRef((props: TextAreaProps, ref: ForwardedRef<HTMLDivElement>) => {
    const Id = useId();
    const [isFocus, setIsFocus] = useState(false);

    const labelClassName = useMemo(() => {
        if (props.value) return "sr-only"
        else return `absolute z-10 font-extralight transition-all ease-in-out 
        ${isFocus
            ? "bottom-[100%] left-[2.4%] text-sm text-primary"
            : "text-base left-[4%] bottom-[70%] text-gray-700"
        }`
    }, [props.value, isFocus])

    const handelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props?.onChange && props.onChange(e)
        setIsFocus(true)
    }
    
    return (
        <div ref={ref} className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {props.label}
                </label>
                <textarea
                    {...props.inputProps}
                    className="p-2 border h-40 resize-none rounded-sm w-full focus:border-none focus:outline-solid focus:outline-2 border-gray-700 hover:border-gray-900 focus:outline-primary"
                    id={Id}
                    value={props.value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={handelChange}
                />
            </div>
        </div>
    )
})

TextArea.displayName = "TextArea";

export default TextArea;