"use client"

import { useState } from "react"
import { PostCanvas } from "@/components/post-canvas"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Download, ImageIcon, Trash2, Copy } from "lucide-react"
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
  white: { name: "Clean White", value: "#ffffff", isDark: false },
  cream: { name: "Warm Cream", value: "#fef9f3", isDark: false },
  lightGray: { name: "Light Gray", value: "#f5f5f5", isDark: false },
  grainy: { name: "Grainy Texture", value: "#f8f8f8", isDark: false },
  dots: { name: "Subtle Dots", value: "#fafafa", isDark: false },
  darkGray: { name: "Dark Gray", value: "#1f2937", isDark: true },
  darkBlue: { name: "Dark Blue", value: "#1e3a8a", isDark: true },
  black: { name: "Black", value: "#0a0a0a", isDark: true },
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

  const currentSlide = slides[currentSlideIndex]

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
    const isDark = BACKGROUNDS[background as keyof typeof BACKGROUNDS]?.isDark
    const newLabelColor = isDark ? "#10b981" : "#3B82F6"

    const updatedSections = currentSlide.sections.map((section) => {
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

    const updatedSlide = { ...currentSlide, background, sections: updatedSections }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
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

  const exportSlide = async () => {
    const html2canvas = (await import("html2canvas")).default
    const element = document.getElementById("post-canvas")
    if (!element) return

    const bgColor = BACKGROUNDS[currentSlide.background as keyof typeof BACKGROUNDS]?.value || "#ffffff"

    const canvas = await html2canvas(element, {
      backgroundColor: bgColor,
      scale: 3,
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: 1080,
      height: 1080,
      windowWidth: 1080,
      windowHeight: 1080,
    })

    const link = document.createElement("a")
    link.download = `slide-${currentSlideIndex + 1}.png`
    link.href = canvas.toDataURL("image/png", 1.0)
    link.click()
  }

  const exportAllAsPDF = async () => {
    const html2canvas = (await import("html2canvas")).default
    const jsPDF = (await import("jspdf")).default
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

      const bgColor = BACKGROUNDS[slides[i].background as keyof typeof BACKGROUNDS]?.value || "#ffffff"

      const canvas = await html2canvas(element, {
        backgroundColor: bgColor,
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 1080,
        height: 1080,
        windowWidth: 1080,
        windowHeight: 1080,
      })

      const imgData = canvas.toDataURL("image/png", 1.0)
      if (i > 0) pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, 0, 1080, 1080)
    }

    pdf.save("carousel-post.pdf")
  }

  return (
    <div className="flex h-screen flex-col bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100">Post Generator</h1>
            <p className="text-xs text-slate-400">Click any text to edit</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportSlide} variant="outline" size="sm" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
              <Download className="mr-2 h-3.5 w-3.5" />
              PNG
            </Button>
            <Button onClick={exportAllAsPDF} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-3.5 w-3.5" />
              PDF All
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-64 border-r border-slate-700 bg-slate-800 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Background Selection */}
            <div>
              <label className="text-xs font-medium text-slate-300 mb-2 block">Background</label>
              <Select value={currentSlide.background} onValueChange={updateBackground}>
                <SelectTrigger className="w-full bg-slate-700 border-slate-600">
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

            {/* Add Elements */}
            <div>
              <label className="text-xs font-medium text-slate-300 mb-2 block">Add Elements</label>
              <div className="space-y-2">
                <Button onClick={() => addSection("label-box")} variant="outline" size="sm" className="w-full justify-start bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Label
                </Button>
                <Button onClick={() => addSection("text-box")} variant="outline" size="sm" className="w-full justify-start bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Text Box
                </Button>
                <Button onClick={() => addSection("image")} variant="outline" size="sm" className="w-full justify-start bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <ImageIcon className="mr-2 h-3.5 w-3.5" />
                  Image
                </Button>
              </div>
            </div>

            {/* Slide Management */}
            <div>
              <label className="text-xs font-medium text-slate-300 mb-2 block">Slides</label>
              <div className="space-y-2">
                <Button onClick={addSlide} variant="outline" size="sm" className="w-full justify-start bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  New Slide
                </Button>
                <Button onClick={duplicateSlide} variant="outline" size="sm" className="w-full justify-start bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  Duplicate
                </Button>
                {slides.length > 1 && (
                  <Button onClick={deleteSlide} variant="outline" size="sm" className="w-full justify-start bg-red-900/50 border-red-800 hover:bg-red-900">
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete Slide
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 overflow-auto">
          <div className="w-full max-w-2xl">
            <PostCanvas
              slide={currentSlide}
              onUpdateSection={updateSection}
              onUpdateAuthor={updateAuthor}
              onDeleteSection={deleteSection}
              onMoveSection={moveSection}
            />
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-300 min-w-[100px] text-center">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
