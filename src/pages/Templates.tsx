
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Book,
    Film,
    Music,
    ArrowRight,
    Sparkles,
    Play,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    ACTIVITY_CATEGORIES,
    ACTIVITY_TEMPLATES,
    TemplateItem,
    RecommendationItem
} from "@/data/templates";

export default function Templates() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);

    const filteredTemplates = selectedCategory === "all"
        ? ACTIVITY_TEMPLATES
        : ACTIVITY_TEMPLATES.filter(t => t.activityId === selectedCategory);

    const handleApplyTemplate = (template: TemplateItem) => {
        navigate("/", { state: { template } });
    };

    const IconForType = ({ type }: { type: RecommendationItem["type"] }) => {
        switch (type) {
            case "book": return <Book className="h-4 w-4" />;
            case "movie": return <Film className="h-4 w-4" />;
            case "music": return <Music className="h-4 w-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Header />

            <main className="container px-4 py-8 animate-fade-in">
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 text-primary bg-primary/5">
                        Curated Experiences
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Find Your <span className="text-gradient">Flow State</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Explore hand-picked combinations of books, films, and music tailored to your current activity.
                    </p>
                </div>

                {/* Category Selector */}
                <div className="mb-12">
                    <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <div className="flex gap-4 px-1">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={cn(
                                    "relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border",
                                    selectedCategory === "all"
                                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-muted"
                                )}
                            >
                                All Collections
                            </button>
                            {ACTIVITY_CATEGORIES.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={cn(
                                        "relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border",
                                        selectedCategory === category.id
                                            ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                            : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-muted"
                                    )}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                {/* Templates Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTemplates.map((template) => {
                        const category = ACTIVITY_CATEGORIES.find(c => c.id === template.activityId);

                        return (
                            <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                            >
                                {/* Gradient Background Effect */}
                                <div className={cn(
                                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br pointer-events-none",
                                    category?.gradient || "from-primary/5 to-transparent"
                                )} />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="secondary" className="bg-background/80 backdrop-blur border-border/50">
                                            {category?.label}
                                        </Badge>
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {template.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                                        {template.description}
                                    </p>

                                    <div className="space-y-3">
                                        {template.recommendations.slice(0, 2).map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-background/50 border border-border/30">
                                                <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                                                    <IconForType type={item.type} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{item.creator}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {template.recommendations.length > 2 && (
                                            <p className="text-xs text-center text-muted-foreground pt-1">
                                                + {template.recommendations.length - 2} more items
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6">
                            <Sparkles className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We are currently curating the perfect collection for this activity. Check back soon!
                        </p>
                    </div>
                )}

            </main>

            {/* Template Detail Dialog */}
            <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[800px]">
                    {selectedTemplate && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="border-primary/20 text-primary">
                                        {ACTIVITY_CATEGORIES.find(c => c.id === selectedTemplate.activityId)?.label}
                                    </Badge>
                                </div>
                                <DialogTitle className="text-3xl font-bold">{selectedTemplate.title}</DialogTitle>
                                <DialogDescription className="text-lg pt-2">
                                    {selectedTemplate.description}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-6">
                                <h4 className="font-semibold flex items-center gap-2 text-foreground/80">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    Included in this set
                                </h4>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {selectedTemplate.recommendations.map((item) => (
                                        <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-border bg-card/50">
                                            <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <IconForType type={item.type} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">{item.title}</p>
                                                <p className="text-xs text-muted-foreground mb-1">{item.creator}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.tags?.map(tag => (
                                                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0 sticky bottom-0 bg-background/95 backdrop-blur py-2 -mx-6 px-6 border-t border-border mt-auto">
                                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                                    Close
                                </Button>
                                <Button onClick={() => handleApplyTemplate(selectedTemplate)} className="gap-2 gradient-primary">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Apply Template
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
