import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = Record<"value" | "label", string>;

interface MultiSelectDropdownProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    label?: string;
    className?: string;
}

export function MultiSelectDropdown({
    options,
    selected,
    onChange,
    placeholder = "Select options...",
    label,
    className,
}: MultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const getDisplayText = () => {
        if (selected.length === 0) return placeholder;
        if (selected.length === 1) {
            const option = options.find((o) => o.value === selected[0]);
            return option?.label || placeholder;
        }
        return `${selected.length} selected`;
    };

    return (
        <div ref={dropdownRef} className={cn("relative w-full", className)}>
            {label && (
                <label className="block text-sm font-medium text-foreground mb-2">
                    {label}
                </label>
            )}

            {/* Dropdown trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between",
                    "px-4 py-3 rounded-lg",
                    "bg-card/50 border border-border/50",
                    "text-foreground text-sm",
                    "hover:border-primary/30 transition-colors",
                    "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                )}
            >
                <span className={selected.length === 0 ? "text-muted-foreground" : ""}>
                    {getDisplayText()}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isOpen && "transform rotate-180"
                    )}
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className={cn(
                        "absolute z-[9999] w-full mt-2",
                        "bg-card/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl",
                        "max-h-64 overflow-y-auto",
                        "animate-in fade-in-0 zoom-in-95"
                    )}
                >
                    <div className="p-2">
                        {options.map((option) => {
                            const isSelected = selected.includes(option.value);
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleToggleOption(option.value)}
                                    className={cn(
                                        "w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-all",
                                        "hover:bg-primary/10",
                                        isSelected
                                            ? "bg-gradient-teal-purple text-white font-medium"
                                            : "text-foreground"
                                    )}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Selected count indicator */}
            {selected.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {selected.map((value) => {
                        const option = options.find((o) => o.value === value);
                        return option ? (
                            <span
                                key={value}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/20 text-primary text-xs"
                            >
                                {option.label}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleOption(value);
                                    }}
                                    className="hover:text-primary-foreground"
                                >
                                    ×
                                </button>
                            </span>
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
}
