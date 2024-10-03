import { Navigate } from "react-router-dom"
import { ACCESS_TOKEN } from "../../lib/constants"


const Logout = () => {
    localStorage.removeItem(ACCESS_TOKEN)

    return<Navigate to='/'/>
}

export default Logout