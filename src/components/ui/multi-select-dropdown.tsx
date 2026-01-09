import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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
    const [open, setOpen] = React.useState(false);

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
        <div className={cn("w-full", className)}>
            {label && (
                <label className="block text-sm font-medium text-foreground mb-2">
                    {label}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
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
                                open && "transform rotate-180"
                            )}
                        />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className={cn(
                        // Match width of trigger if possible, or use w-[var(--radix-popover-trigger-width)]
                        "w-[var(--radix-popover-trigger-width)] p-2",
                        "bg-card/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl"
                    )}
                    align="start"
                >
                    <div className="max-h-64 overflow-y-auto">
                        {options.map((option) => {
                            const isSelected = selected.includes(option.value);
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleToggleOption(option.value)}
                                    className={cn(
                                        "w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-all",
                                        "hover:bg-primary/10 text-left",
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
                </PopoverContent>
            </Popover>

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
