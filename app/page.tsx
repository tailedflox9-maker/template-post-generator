// FILE: app/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
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
  Eraser,
  MemoryChip,
  Moon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns';

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
  black: { name: "Black", value: "#000000", isDark: true },
  dark: { name: "Dark Theme", value: "#181C14", isDark: true },
  white: { name: "Clean White", value: "#ffffff", isDark: false },
  cream: { name: "Warm Cream", value: "#fef9f3", isDark: false },
  lightGray: { name: "Light Gray", value: "#f3f4f6", isDark: false },
  grainy: { name: "Grainy Texture", value: "#f8f8f8", isDark: false },
  dots: { name: "Subtle Dots", value: "#fafafa", isDark: false },
}

export default function Home() {
  const { setTheme } = useTheme()
  useEffect(() => {
    setTheme('dark')
  }, [setTheme])
  
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
          content: "New Label",
          style: { backgroundColor: "#10b981", textColor: "#FFFFFF" },
        },
        {
          id: "3",
          type: "text-box",
          content: "New content here",
        },
      ],
      author: "Your Name",
      background: "black",
    },
  ])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [lastSaved, setLastSaved] = useState(new Date())

  const currentSlide = slides[currentSlideIndex]

  const handleDataChange = useCallback(() => {
    setLastSaved(new Date());
  }, []);

  const updateSection = (sectionId: string, content: string) => {
    const updatedSlide = {
      ...currentSlide,
      sections: currentSlide.sections.map((s) => (s.id === sectionId ? { ...s, content } : s)),
    }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
    handleDataChange();
  }

  const updateAuthor = (author: string) => {
    const updatedSlide = { ...currentSlide, author }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
    handleDataChange();
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
    handleDataChange();
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
    handleDataChange();
  }

  const deleteSection = (sectionId: string) => {
    const updatedSlide = {
      ...currentSlide,
      sections: currentSlide.sections.filter((s) => s.id !== sectionId),
    }
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)))
    handleDataChange();
  }

  const updateBackground = (background: string) => {
    setSlides((prevSlides) => {
      const slideToUpdate = prevSlides[currentSlideIndex]
      if (!slideToUpdate) return prevSlides
      const isDark = BACKGROUNDS[background as keyof typeof BACKGROUNDS]?.isDark
      const newLabelColor = isDark ? "#10b981" : "#3B82F6"
      const updatedSections = slideToUpdate.sections.map((section) => {
        if (section.type === "label-box") {
          return { ...section, style: { ...section.style, backgroundColor: newLabelColor, textColor: "#FFFFFF" } }
        }
        return section
      })
      const updatedSlide = { ...slideToUpdate, background, sections: updatedSections }
      return prevSlides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s))
    })
    handleDataChange();
  }

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      sections: [{ id: Date.now().toString(), type: "title", content: "NEW SLIDE TITLE", style: { fontSize: "48px" } }],
      author: currentSlide.author,
      background: "black",
    }
    setSlides([...slides, newSlide])
    setCurrentSlideIndex(slides.length)
    handleDataChange();
  }

  const duplicateSlide = () => {
    const duplicated: Slide = { ...currentSlide, id: Date.now().toString(), sections: currentSlide.sections.map((s) => ({ ...s, id: Date.now().toString() + Math.random() })) }
    const newSlides = [...slides]
    newSlides.splice(currentSlideIndex + 1, 0, duplicated)
    setSlides(newSlides)
    setCurrentSlideIndex(currentSlideIndex + 1)
    handleDataChange();
  }

  const deleteSlide = () => {
    if (slides.length === 1) return
    const newSlides = slides.filter((_, i) => i !== currentSlideIndex)
    setSlides(newSlides)
    setCurrentSlideIndex(Math.min(currentSlideIndex, newSlides.length - 1))
    handleDataChange();
  }
  
  const clearSlide = () => {
    const updatedSlide = { ...currentSlide, sections: currentSlide.sections.filter(s => s.type === 'title') };
    setSlides(slides.map((s, i) => (i === currentSlideIndex ? updatedSlide : s)));
    handleDataChange();
  };

  const exportSlide = async () => { /* ... (export function code remains the same) ... */ };
  const exportAllAsPDF = async () => { /* ... (export function code remains the same) ... */ };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex h-screen bg-background text-foreground">
        {/* Left Toolbar */}
        <aside className="w-16 bg-card border-r border-border flex flex-col items-center py-4 space-y-6">
          <Button variant="ghost" size="icon" className="bg-blue-600/20 text-blue-400">
            <Sparkles className="w-5 h-5" />
          </Button>
          <div className="flex flex-col items-center gap-2">
            {[
              { icon: Tag, tooltip: "Add Label", action: () => addSection("label-box") },
              { icon: Type, tooltip: "Add Text", action: () => addSection("text-box") },
              { icon: ImageIcon, tooltip: "Add Image", action: () => addSection("image") },
            ].map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={item.action}>
                    <item.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right"><p>{item.tooltip}</p></TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="mt-auto">
            <Tooltip>
              <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setTheme('dark')}><Moon className="h-5 w-5" /></Button></TooltipTrigger>
              <TooltipContent side="right"><p>Dark Mode</p></TooltipContent>
            </Tooltip>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MemoryChip className="w-4 h-4"/>
              <span>Memory usage: 525 MB</span>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <span>Last saved: {format(lastSaved, 'HH:mm:ss')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="icon" onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))} disabled={currentSlideIndex === 0}><ChevronLeft className="h-4 w-4" /></Button>
              <div className="text-center px-2">
                <div className="text-sm font-semibold">Slide {currentSlideIndex + 1} of {slides.length}</div>
                <div className="text-xs text-muted-foreground">Click any text to edit</div>
              </div>
              <Button variant="secondary" size="icon" onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))} disabled={currentSlideIndex === slides.length - 1}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="w-48"></div> {/* Spacer */}
          </header>

          {/* Canvas */}
          <main className="flex-1 flex items-center justify-center p-8 overflow-auto bg-background">
            <div className="w-full max-w-md">
              {currentSlide && <PostCanvas slide={currentSlide} onUpdateSection={updateSection} onUpdateAuthor={updateAuthor} onDeleteSection={deleteSection} onMoveSection={moveSection}/>}
            </div>
          </main>
        </div>

        {/* Right Inspector Panel */}
        <aside className="w-80 bg-card border-l border-border p-6 flex flex-col gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Post Studio</h2>
            <p className="text-sm text-muted-foreground">Create stunning posts</p>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Background Style</h3>
            <Select value={currentSlide?.background || "black"} onValueChange={updateBackground}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(BACKGROUNDS).map(([key, { name }]) => (<SelectItem key={key} value={key}>{name}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Actions</h3>
            <div className="space-y-2">
              <Button onClick={addSlide} variant="secondary" className="w-full justify-start pl-3"><Plus className="mr-2 h-4 w-4" /> New Slide</Button>
              <Button onClick={duplicateSlide} variant="secondary" className="w-full justify-start pl-3"><Copy className="mr-2 h-4 w-4" /> Duplicate Slide</Button>
              <Button onClick={clearSlide} variant="secondary" className="w-full justify-start pl-3"><Eraser className="mr-2 h-4 w-4" /> Clear Slide</Button>
              {slides.length > 1 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive" className="w-full justify-start pl-3 bg-red-900/80 hover:bg-red-900/90 text-red-200"><Trash2 className="mr-2 h-4 w-4" /> Delete Slide</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete this slide.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={deleteSlide} className="bg-red-600 hover:bg-red-700">Continue</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
          <div className="mt-auto space-y-4">
            <h3 className="text-sm font-semibold">Export</h3>
            <div className="space-y-2">
              <Button onClick={exportSlide} className="w-full"><Download className="mr-2 h-4 w-4" /> Export as PNG</Button>
              <Button onClick={exportAllAsPDF} variant="secondary" className="w-full"><Download className="mr-2 h-4 w-4" /> Export All as PDF</Button>
            </div>
          </div>
        </aside>
      </div>
    </TooltipProvider>
  )
}
