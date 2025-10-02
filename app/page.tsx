// FILE: app/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { PostCanvas } from "@/components/post-canvas"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  ImageIcon,
  Copy,
  Trash2,
  Type,
  Tag,
  Eraser,
  Loader2,
  PenSquare,
  AlertCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Section {
  id: string
  type: "title" | "label-box" | "text-box" | "image"
  content: string
  style?: {
    backgroundColor?: string
    textColor?: string
    fontSize?: string
  }
}

export interface Slide {
  id: string
  sections: Section[]
  author: string
  background: string
}

const BACKGROUNDS = {
  dark: { name: "Dark Theme", value: "#181C14", isDark: true },
  black: { name: "Black", value: "#0a0a0a", isDark: true },
  white: { name: "Clean White", value: "#ffffff", isDark: false },
  cream: { name: "Warm Cream", value: "#fef9f3", isDark: false },
  lightGray: { name: "Light Gray", value: "#f3f4f6", isDark: false },
  grainy: { name: "Grainy Texture", value: "#f8f8f8", isDark: false },
  dots: { name: "Subtle Dots", value: "#fafafa", isDark: false },
}

const defaultSlides: Slide[] = [
  {
    id: "1",
    sections: [
      {
        id: "1",
        type: "title",
        content: "YOUR POST TITLE HERE",
        style: { fontSize: "48px" },
      },
      {
        id: "2",
        type: "label-box",
        content: "Section Label",
        style: { backgroundColor: "#10b981", textColor: "#FFFFFF" },
      },
      {
        id: "3",
        type: "text-box",
        content: "Add your main content here. Click to edit any text.",
      },
    ],
    author: "Your Name",
    background: "white",
  },
]

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isExportingPNG, setIsExportingPNG] = useState(false)
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    try {
      const savedState = localStorage.getItem("postGeneratorState")
      if (savedState) {
        const { slides: savedSlides, currentSlideIndex: savedIndex } = JSON.parse(savedState)
        if (savedSlides && Array.isArray(savedSlides) && savedSlides.length > 0 && typeof savedIndex === 'number') {
          setSlides(savedSlides)
          setCurrentSlideIndex(Math.min(savedIndex, savedSlides.length - 1))
        }
      }
    } catch (error) {
      console.error("Failed to load state from local storage", error)
      setSlides(defaultSlides)
      setCurrentSlideIndex(0)
    }
  }, [])

  useEffect(() => {
    if (isClient && slides.length > 0) {
      try {
        const stateToSave = JSON.stringify({ slides, currentSlideIndex })
        localStorage.setItem("postGeneratorState", stateToSave)
      } catch (error) {
        console.error("Failed to save state to local storage", error)
      }
    }
  }, [slides, currentSlideIndex, isClient])

  const currentSlide = slides[currentSlideIndex] || slides[0]

  const updateSection = (sectionId: string, content: string) => {
    const updatedSlide = {
      ...currentSlide,
      sections: currentSlide.sections.map((s) => (s.id === sectionId ? { ...s, content } : s)),
    }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
  }

  const updateAuthor = (author: string) => {
    const updatedSlide = { ...currentSlide, author }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
  }

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const index = currentSlide.sections.findIndex((s) => s.id === sectionId)
    if ((direction === "up" && index === 0) || (direction === "down" && index === currentSlide.sections.length - 1)) {
      return
    }
    const newSections = [...currentSlide.sections]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    const updatedSlide = { ...currentSlide, sections: newSections }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
  }

  const addSection = (type: Section["type"]) => {
    const isDark = BACKGROUNDS[currentSlide.background as keyof typeof BACKGROUNDS]?.isDark
    const labelColor = isDark ? "#34d399" : "#10b981"
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      content: type === "label-box" ? "New Label" : type === "image" ? "" : "New content here",
      style: type === "label-box" ? { backgroundColor: labelColor, textColor: "#FFFFFF" } : {},
    }
    const updatedSlide = { ...currentSlide, sections: [...currentSlide.sections, newSection] }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
  }

  const deleteSection = (sectionId: string) => {
    const updatedSlide = {
      ...currentSlide,
      sections: currentSlide.sections.filter((s) => s.id !== sectionId),
    }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
  }

  const updateBackground = (background: string) => {
    setSlides((prevSlides) => {
      const slideToUpdate = prevSlides[currentSlideIndex]
      if (!slideToUpdate) return prevSlides
      const isDark = BACKGROUNDS[background as keyof typeof BACKGROUNDS]?.isDark
      const newLabelColor = isDark ? "#34d399" : "#10b981"
      const updatedSections = slideToUpdate.sections.map((section) => {
        if (section.type === "label-box") {
          return { ...section, style: { ...section.style, backgroundColor: newLabelColor, textColor: "#FFFFFF" } }
        }
        return section
      })
      const updatedSlide = { ...slideToUpdate, background, sections: updatedSections }
      return prevSlides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s))
    })
  }

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      sections: [{ id: Date.now().toString(), type: "title", content: "NEW SLIDE TITLE", style: { fontSize: "48px" } }],
      author: currentSlide.author,
      background: "white",
    }
    setSlides([...slides, newSlide])
    setCurrentSlideIndex(slides.length)
  }

  const duplicateSlide = () => {
    const duplicated: Slide = {
      ...currentSlide,
      id: Date.now().toString(),
      sections: currentSlide.sections.map((s) => ({ ...s, id: Date.now().toString() + Math.random() })),
    }
    const newSlides = [...slides]
    newSlides.splice(currentSlideIndex + 1, 0, duplicated)
    setSlides(newSlides)
    setCurrentSlideIndex(currentSlideIndex + 1)
  }

  const deleteSlide = () => {
    if (slides.length === 1) return
    const newSlides = slides.filter((_, i) => i !== currentSlideIndex)
    setSlides(newSlides)
    setCurrentSlideIndex(Math.min(currentSlideIndex, newSlides.length - 1))
  }

  const clearSlide = () => {
    const updatedSlide = { ...currentSlide, sections: currentSlide.sections.filter((s) => s.type === "title") }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
  }

  // FIXED EXPORT FUNCTION
  const exportSlide = async () => {
    setIsExportingPNG(true);
    setExportError(null);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("post-canvas");
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: true,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.download = `slide-${currentSlideIndex + 1}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        } else {
          throw new Error("Failed to create image blob.");
        }
      }, "image/png", 1.0);
    } catch (error) {
        console.error("Failed to export PNG:", error);
        setExportError(error instanceof Error ? error.message : "An unknown error occurred during PNG export.");
    } finally {
        setIsExportingPNG(false);
    }
  };

  // FIXED EXPORT ALL AS PDF FUNCTION
  const exportAllAsPDF = async () => {
    setIsExportingPDF(true);
    setExportError(null);
    const originalIndex = currentSlideIndex;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { default: jsPDF } = (await import("jspdf"));
      const element = document.getElementById("post-canvas");
      if (!element) return;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1080, 1080],
        compress: true,
      });

      for (let i = 0; i < slides.length; i++) {
        setCurrentSlideIndex(i);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 3,
          logging: false,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 0,
        });

        const imgData = canvas.toDataURL("image/png", 1.0);
        if (i > 0) pdf.addPage([1080, 1080], "portrait");
        pdf.addImage(imgData, "PNG", 0, 0, 1080, 1080, undefined, "FAST");
      }

      pdf.save("carousel-post.pdf");
    } catch (error) {
        console.error("Failed to export PDF:", error);
        setExportError(error instanceof Error ? error.message : "An unknown error occurred during PDF export.");
    } finally {
        setCurrentSlideIndex(originalIndex);
        setIsExportingPDF(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-[#212121] text-zinc-300 font-sans text-sm">
        <aside className="w-16 flex flex-col items-center py-4 bg-black/20 border-r border-zinc-800">
          <div className="w-9 h-9 rounded-lg bg-zinc-700 flex items-center justify-center shadow-md">
            <PenSquare className="w-5 h-5 text-zinc-300" />
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center justify-between px-4 border-b border-zinc-800 bg-[#2D2D2D] z-10">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))} 
                disabled={currentSlideIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-semibold text-white">
                Slide {currentSlideIndex + 1} of {slides.length}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))} 
                disabled={currentSlideIndex === slides.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 bg-[#E0E0E0] p-10 relative overflow-auto flex items-center justify-center">
            <div className="w-full max-w-xl" ref={canvasRef}>
              {currentSlide && (
                <PostCanvas 
                  slide={currentSlide} 
                  onUpdateSection={updateSection} 
                  onUpdateAuthor={updateAuthor} 
                  onDeleteSection={deleteSection} 
                  onMoveSection={moveSection} 
                />
              )}
            </div>

            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#2D2D2D] text-white rounded-lg shadow-2xl flex items-center p-1.5 gap-1 border border-zinc-700">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-zinc-700" onClick={() => addSection("label-box")}>
                    <Tag className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Add Label</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-zinc-700" onClick={() => addSection("text-box")}>
                    <Type className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Add Text Box</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-zinc-700" onClick={() => addSection("image")}>
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Add Image</TooltipContent>
              </Tooltip>
            </div>
          </main>
        </div>

        <aside className="w-72 p-4 space-y-4 border-l border-zinc-800 bg-[#2D2D2D] text-sm overflow-y-auto">
          <h2 className="text-lg font-semibold text-white">Post Studio</h2>
          
          {exportError && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-300">{exportError}</div>
            </div>
          )}

          <Accordion type="multiple" defaultValue={['actions', 'background', 'export']} className="w-full">
            <AccordionItem value="actions">
              <AccordionTrigger>Post Actions</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 p-1">
                  <Button onClick={addSlide} variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" /> New Slide
                  </Button>
                  <Button onClick={duplicateSlide} variant="outline" size="sm" className="w-full justify-start">
                    <Copy className="mr-2 h-4 w-4" /> Duplicate Slide
                  </Button>
                  <Button onClick={clearSlide} variant="outline" size="sm" className="w-full justify-start">
                    <Eraser className="mr-2 h-4 w-4" /> Clear Slide
                  </Button>
                  {slides.length > 1 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full justify-start">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Slide
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this slide.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteSlide}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="background">
              <AccordionTrigger>Background Style</AccordionTrigger>
              <AccordionContent>
                <div className="p-1">
                  <Select value={currentSlide?.background || "white"} onValueChange={updateBackground}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BACKGROUNDS).map(([key, { name }]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="export">
              <AccordionTrigger>Export Options</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 p-1">
                  <Button 
                    onClick={exportSlide} 
                    variant="secondary" 
                    className="w-full justify-start" 
                    disabled={isExportingPNG || isExportingPDF}
                  >
                    {isExportingPNG ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {isExportingPNG ? "Exporting..." : "Export Current as PNG"}
                  </Button>
                  <Button 
                    onClick={exportAllAsPDF} 
                    variant="secondary" 
                    className="w-full justify-start" 
                    disabled={isExportingPDF || isExportingPNG}
                  >
                    {isExportingPDF ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {isExportingPDF ? "Creating PDF..." : "Export All as PDF"}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>
      </div>
    </TooltipProvider>
  )
}
