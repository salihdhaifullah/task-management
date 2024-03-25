import { type KeyboardEvent, type SetStateAction, useEffect, useId, useRef, useState } from "react";
import TextFiled from "./TextFiled";
import useOnClickOutside from '../hooks/useOnClickOutside';

interface ISelectProps {
    value: string
    setValue: (value: SetStateAction<string>) => void
    label: string
    options: string[]
    allowCustom?: boolean
    required?: boolean
}

const activeOptionInit = (array: string[], value: string) => {
    const option = array.indexOf(value);
    if (option > -1) return option;
    else return 0;
}

const scrollToEle = (container: HTMLElement, ele: HTMLElement) => {
    const containerRect = container.getBoundingClientRect();
    const elementRect = ele.getBoundingClientRect();

    const yAxisPosition = elementRect.top - containerRect.top + container.scrollTop;

    container.scrollTop = yAxisPosition;
}

const Select = (props: ISelectProps) => {
    const id = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [activeOption, setActiveOption] = useState(activeOptionInit(props.options, props.value));

    const targetRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDataListElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const choseOption = (optionIndex: number) => {
        if (props.options.length > 0 || props.value.trim().length < 0) {
            props.setValue(props.options[optionIndex]!)
        }
        setIsOpen(false);
    }

    useEffect(() => {
        const ele = document.getElementById(`${id}-option-${activeOption}`);
        if (dropdownRef.current && ele) scrollToEle(dropdownRef.current, ele);
    }, [activeOption, id, isOpen])

    useEffect(() => {
        setActiveOption(activeOptionInit(props.options, props.value))
    }, [isOpen, props.options, props.value])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown" && activeOption !== (props.options.length - 1)) {
            e.preventDefault();
            setActiveOption((prev) => prev + 1);
        }

        if (e.key === "Enter") {
            e.preventDefault();
            choseOption(activeOption)
        }
    }

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp" && activeOption !== 0) {
            e.preventDefault();
            setActiveOption((prev) => prev - 1);
        }
    }

    return (
        <div
            ref={targetRef}
            className="flex flex-row gap-2 w-full justify-center items-center relative">
            <TextFiled
                autoComplete="off"
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                value={props.value}
                onChange={(e) => {
                    props.setValue(e.currentTarget.value)
                    setIsOpen(true)
                }}
                readOnly={!props.allowCustom}
                label={props.label}
                required={props.required}
            />

            <datalist
                ref={dropdownRef}
                className={`${isOpen && (props.options.length > 0 || props.value.trim().length > 0) ? "block" : "none"} absolute w-full shadow-lg z-40 max-h-40 top-[100%] bg-white rounded-md p-2 overflow-y-scroll`}>
                {props.options.map((option, index) => (
                    <option
                        key={option}
                        id={`${id}-option-${index}`}
                        onClick={() => choseOption(index)}
                        className={`${index === activeOption ? "bg-slate-200 font-extrabold" : "bg-white"} block rounded-md text-gray-600 p-1 mb-1 text-base cursor-pointer`}
                        value={option}>
                        {option}
                    </option>
                ))}

                {!(props.options.length < 1 && props.value.trim().length > 0) ? null : (
                    <option
                        className="bg-slate-200 font-extrabold flex flex-1 rounded-md text-gray-600 p-1 mb-1 text-base cursor-pointer"
                        value={props.value}
                        onClick={() => choseOption(0)}>
                        Add {props.value}
                    </option>
                )}
            </datalist>
        </div>
    )
}


export default Select;