import { FaRegSun } from "react-icons/fa6";

/**
 * A simple loader
 * @param message {string} - Message to be displayed below the loading animation
 * @returns React Elements {JSX.Element} - A simple loader consisting of an animating icon and some message
 */
export default function Loader({message}: {message: string | null}) {
    return (
        <div className="loader">
            <FaRegSun/>
            {message != null && message.trim() != '' && <p>{message}</p>}
        </div>
    )
}