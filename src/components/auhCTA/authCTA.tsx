import { Link } from "react-router-dom";
import Button from "../button/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

function AuthCTA() {
    const { user } = useContext(AuthContext);
    if (user && user.displayName) {
    const initial = user.displayName[0].toUpperCase();
    return (
        <Link to={"/account/dashboard"} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">{initial}</Link>
    );
    }

    return (
    <Button href="/auth/register" size="small">Sign up</Button>
    );
}

export default AuthCTA