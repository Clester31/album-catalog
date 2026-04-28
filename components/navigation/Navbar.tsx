import SignInFeatures from "../clerk/SignInFeatures";

export default function Navbar() {
    return (
        <div className="flex flex-row items-center justify-between bg-primary-foreground p-1 h-12 border-b-2 border-b-accent">
            <div className="nav-left">
                <h1>Website</h1>
            </div>
            <div className="nav-left">
                <SignInFeatures />
            </div>
        </div>
    )
}