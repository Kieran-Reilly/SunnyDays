import { FaRegSun } from "react-icons/fa6";

export default function Loader({message}: {message: string | null}) {
    return (
        <div className="loader">
            <FaRegSun/>
            {message != null && message.trim() != '' && <p>{message}</p>}
        </div>
    )
}