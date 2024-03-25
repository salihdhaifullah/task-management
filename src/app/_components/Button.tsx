import { type HTMLProps, type ReactElement } from 'react';
import CircleProgress from './CircleProgress'

type Size = "sm" | "md" | "lg";

function getSize(size?: Size) {
    let sizeClass = "";

    switch (size) {
        case "sm":
            sizeClass = "text-sm px-1 py-0.5";
            break;
        case "md":
            sizeClass = "text-base px-2 py-1";
            break;
        case "lg":
            sizeClass = "text-lg px-3 py-1.5";
            break;
        default:
            sizeClass = "text-base px-2 p-1"
            break;
    }

    return sizeClass;
}


interface IButtonProps extends HTMLProps<HTMLButtonElement> {
    className?: string
    children?: ReactElement | ReactElement[] | string
    onClick?: () => void;
    isLoading?: boolean;
    isValid?: boolean;
    type?: "button" | "submit" | "reset"
    buttonSize?: Size
}

const Button = (props: IButtonProps) => {
    const { isLoading, isValid, onClick, className, buttonSize, children, ...rest } = props;

    return (
        <button
            {...rest}
            disabled={isValid === false || isLoading}
            onClick={onClick}
            className={`${getSize(buttonSize)}
                ${isValid === false ? "bg-gray-300 cursor-not-allowed" : isLoading ? "cursor-wait" : "cursor-pointer"}
                ${className ?? ""} rounded-md border-0 outline-none whitespace-nowrap font-bold text-secondary hover:text-white hover:bg-black bg-white text-center transition-all ease-in-out shadow-md hover:shadow-lg hover:border-gray-600 w-fit h-fit
            `}>

            {isLoading ? <CircleProgress size="xm" /> : children}
        </button>
    )
}

export default Button;