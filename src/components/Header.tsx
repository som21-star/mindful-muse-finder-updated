
import { useNavigate } from "react-router-dom";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/Auth";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Header = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                        <Sun className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-serif font-semibold text-lg text-foreground">Conscious</span>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) => cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/templates"
                        className={({ isActive }) => cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Templates
                    </NavLink>
                    <NavLink
                        to="/insights"
                        className={({ isActive }) => cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Insights
                    </NavLink>
                    <NavLink
                        to="/favorites"
                        className={({ isActive }) => cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Favorites
                    </NavLink>
                </nav>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            await signOut();
                            navigate("/auth");
                        }}
                    >
                        Sign out
                    </Button>
                </div>
            </div>
        </header>
    );
};
