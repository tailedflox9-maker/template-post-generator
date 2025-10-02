// FILE: app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
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
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  ImageIcon,
  Copy,
  Trash2,
  Sparkles,
  Type,
  Tag,
  Eraser
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"

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

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([
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
          style: { backgroundColor: "#3B82F6", textColor: "#FFFFFF" },
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
  ])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const { theme } = useTheme()

  const currentSlide = slides[currentSlideIndex]

  useEffect(() => {
    if (theme) {
      const newBackground = theme === "dark" ? "black" : "white"

      setSlides((prevSlides) => {
        const slideToUpdate = prevSlides[currentSlideIndex]
        if (!slideToUpdate) return prevSlides

        const isCurrentBgDark = BACKGROUNDS[slideToUpdate.background as keyof typeof BACKGROUNDS]?.isDark
        const shouldUpdateToDark = theme === "dark" && !isCurrentBgDark
        const shouldUpdateToLight = theme === "light" && isCurrentBgDark

        if (!shouldUpdateToDark && !shouldUpdateToLight) {
          return prevSlides
        }

        const isDark = BACKGROUNDS[newBackground as keyof typeof BACKGROUNDS]?.isDark
        const newLabelColor = isDark ? "#10b981" : "#3B82F6"

        const updatedSections = slideToUpdate.sections.map((section) => {
          if (section.type === "label-box") {
            return {
              ...section,
              style: {
                ...section.style,
                backgroundColor: newLabelColor,
                textColor: "#FFFFFF",
              },
            }
          }
          return section
        })

        const updatedSlide = { ...slideToUpdate, background: newBackground, sections: updatedSections }
        return prevSlides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s))
      })
    }
  }, [theme, currentSlideIndex])

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
    const labelColor = isDark ? "#10b981" : "#3B82F6"

    const newSection: Section = {
      id: Date.now().toString(),
      type,
      content: type === "label-box" ? "New Label" : type === "image" ? "" : "New content here",
      style: type === "label-box" ? { backgroundColor: labelColor, textColor: "#FFFFFF" } : {},
    }
    const updatedSlide = {
      ...currentSlide,
      sections: [...currentSlide.sections, newSection],
    }
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
      const newLabelColor = isDark ? "#10b981" : "#3B82F6"

      const updatedSections = slideToUpdate.sections.map((section) => {
        if (section.type === "label-box") {
          return {
            ...section,
            style: { ...section.style, backgroundColor: newLabelColor, textColor: "#FFFFFF" },
          }
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
      sections: [
        {
          id: Date.now().toString(),
          type: "title",
          content: "NEW SLIDE TITLE",
          style: { fontSize: "48px" },
        },
      ],
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
      sections: currentSlide.sections.map((s) => ({
        ...s,
        id: Date.now().toString() + Math.random(),
      })),
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
    const updatedSlide = {
      ...currentSlide,
      sections: currentSlide.sections.filter(s => s.type === 'title'), // Keep only the title
    };
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)));
  };

  const exportSlide = async () => {
    const { default: html2canvas } = await import("html2canvas")
    const element = document.getElementById("post-canvas")
    if (!element) return

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 3,
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
      removeContainer: true,
    })

    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement("a")
        link.download = `slide-${currentSlideIndex + 1}.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)
      }
    }, "image/png", 1.0)
  }

  const exportAllAsPDF = async () => {
    const { default: html2canvas } = await import("html2canvas")
    const { default: jsPDF } = await import("jspdf")
    const element = document.getElementById("post-canvas")
    if (!element) return

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [1080, 1080],
    })

    for (let i = 0; i < slides.length; i++) {
      setCurrentSlideIndex(i)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
      })

      const imgData = canvas.toDataURL("image/png", 1.0)
      if (i > 0) pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, 0, 1080, 1080)
    }

    pdf.save("carousel-post.pdf")
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Left Toolbar */}
        <aside className="w-16 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 space-y-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => addSection("label-box")}>
                  <Tag className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Label</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => addSection("text-box")}>
                  <Type className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Text Box</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => addSection("image")}>
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Image</TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-auto">
            <ThemeToggle />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar with Slide Navigation */}
          <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-center px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <div className="text-sm font-semibold">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </div>
                <div className="text-xs text-muted-foreground">Click any text to edit</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === slides.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Canvas */}
          <main className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div className="w-full max-w-xl">
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
          </main>
        </div>

        {/* Right Inspector Panel */}
        <aside className="w-80 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-semibold">Post Studio</h2>
            <p className="text-sm text-muted-foreground">Create stunning posts</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Background Style</h3>
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

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
            <div className="space-y-2">
              <Button onClick={addSlide} variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> New Slide
              </Button>
              <Button onClick={duplicateSlide} variant="outline" size="sm" className="w-full">
                <Copy className="mr-2 h-4 w-4" /> Duplicate Slide
              </Button>
              <Button onClick={clearSlide} variant="outline" size="sm" className="w-full">
                <Eraser className="mr-2 h-4 w-4" /> Clear Slide
              </Button>
              {slides.length > 1 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
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
          </div>

          <div className="mt-auto space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Export</h3>
            <div className="space-y-2">
              <Button onClick={exportSlide} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Export as PNG
              </Button>
              <Button onClick={exportAllAsPDF} variant="secondary" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Export All as PDF
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </TooltipProvider>
  )
}
