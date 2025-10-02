// FILE: components/post-canvas.tsx
"use client"

import { useState, useRef, useCallback } from "react"
import type { Slide } from "@/app/page"
import { ArrowRight, X, ChevronUp, ChevronDown, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostCanvasProps {
  slide: Slide
  onUpdateSection: (sectionId: string, content: string) => void
  onUpdateAuthor: (author: string) => void
  onDeleteSection: (sectionId: string) => void
  onMoveSection: (sectionId: string, direction: "up" | "down") => void
}

const getBackgroundStyle = (background: string) => {
  switch (background) {
    case "dark": 
      return { backgroundColor: "#181C14" }
    case "white": 
      return { backgroundColor: "#ffffff" }
    case "cream": 
      return { backgroundColor: "#fef9f3" }
    case "lightGray": 
      return { backgroundColor: "#f3f4f6" }
    case "grainy": 
      return { 
        backgroundColor: "#f8f8f8", 
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.03) 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.03) 3px)` 
      }
    case "dots": 
      return { 
        backgroundColor: "#fafafa", 
        backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.08) 1px, transparent 1px)`, 
        backgroundSize: "20px 20px" 
      }
    case "black": 
      return { backgroundColor: "#0a0a0a" }
    default: 
      return { backgroundColor: "#ffffff" }
  }
}

const isDarkBackground = (background: string) => {
  return ["dark", "black"].includes(background)
}

export function PostCanvas({
  slide,
  onUpdateSection,
  onUpdateAuthor,
  onDeleteSection,
  onMoveSection,
}: PostCanvasProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null)

  const isDark = isDarkBackground(slide.background)
  const textColor = isDark ? "#ffffff" : "#1f2937"
  const borderColor = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
  const ghostButtonColor = isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"

  const handleImageUpload = useCallback((sectionId: string, file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      setImageError("Please select a valid image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setImageError("Image size must be less than 10MB")
      return
    }

    setImageError(null)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      if (imageUrl) {
        onUpdateSection(sectionId, imageUrl)
        setUploadingImageId(null)
      }
    }
    reader.onerror = () => {
      setImageError("Failed to read image file")
      setUploadingImageId(null)
    }
    reader.readAsDataURL(file)
  }, [onUpdateSection])

  const handleSectionEdit = useCallback((sectionId: string, text: string) => {
    onUpdateSection(sectionId, text || "")
  }, [onUpdateSection])

  const handleAuthorEdit = useCallback((text: string) => {
    onUpdateAuthor(text || "Your Name")
  }, [onUpdateAuthor])

  return (
    <div
      id="post-canvas"
      className="relative aspect-square w-full rounded-xl p-12 shadow-2xl border border-black/10"
      style={getBackgroundStyle(slide.background)}
    >
      <div className="flex h-full flex-col gap-6">
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
          {slide.sections.map((section, index) => (
            <div key={section.id} className="group relative">
              {/* Move controls */}
              {editingId !== section.id && (
                <div className="absolute -left-10 top-0 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {index > 0 && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={`h-6 w-6 ${ghostButtonColor}`} 
                      onClick={() => onMoveSection(section.id, "up")}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  )}
                  {index < slide.sections.length - 1 && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={`h-6 w-6 ${ghostButtonColor}`} 
                      onClick={() => onMoveSection(section.id, "down")}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              {/* Delete button */}
              {editingId !== section.id && section.type !== "title" && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`absolute -right-2 -top-2 z-10 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ${ghostButtonColor}`} 
                  onClick={() => onDeleteSection(section.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              {/* Section content */}
              {section.type === "title" && (
                <h1
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => setEditingId(section.id)}
                  onBlur={(e) => {
                    setEditingId(null)
                    handleSectionEdit(section.id, e.currentTarget.textContent || "")
                  }}
                  className="cursor-text text-balance text-5xl font-bold leading-tight outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 rounded-md px-2 py-1"
                  style={{ 
                    fontSize: section.style?.fontSize || "48px", 
                    color: textColor, 
                    margin: 0, 
                    lineHeight: "1.1" 
                  }}
                >{section.content}</h1>
              )}

              {section.type === "label-box" && (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => setEditingId(section.id)}
                  onBlur={(e) => {
                    setEditingId(null)
                    handleSectionEdit(section.id, e.currentTarget.textContent || "")
                  }}
                  className="inline-block cursor-text rounded-lg px-6 py-3 text-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                  style={{
                    backgroundColor: section.style?.backgroundColor,
                    color: section.style?.textColor || "#FFFFFF",
                    lineHeight: "1.5",
                  }}
                >{section.content}</span>
              )}

              {section.type === "text-box" && (
                <div
                  className="cursor-text rounded-lg border-2 p-6 text-lg leading-relaxed outline-none focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:ring-offset-2"
                  style={{ borderColor: borderColor, color: textColor, minHeight: "100px", display: "flex", alignItems: "center" }}
                >
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={() => setEditingId(section.id)}
                    onBlur={(e) => {
                      setEditingId(null)
                      handleSectionEdit(section.id, e.currentTarget.textContent || "")
                    }}
                    className="w-full outline-none"
                    style={{ margin: 0 }}
                  >{section.content}</p>
                </div>
              )}

              {section.type === "image" && (
                <div className="relative flex flex-col items-center justify-center">
                  {section.content ? (
                    <div className="relative group/image">
                      <img
                        src={section.content}
                        alt="Uploaded content"
                        className="max-h-64 max-w-full rounded-lg object-contain"
                        style={{ imageRendering: "high-quality", width: "auto", height: "auto" }}
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover/image:opacity-100"
                        onClick={() => {
                          setUploadingImageId(section.id)
                          fileInputRef.current?.click()
                        }}
                      >Change Image</Button>
                    </div>
                  ) : (
                    <div
                      className="flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-all hover:border-primary/50 hover:bg-primary/10"
                      style={{ borderColor: isDark ? "#4b5563" : "#d1d5db" }}
                      onClick={() => {
                        setUploadingImageId(section.id)
                        fileInputRef.current?.click()
                      }}
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-10 w-10 mb-2" style={{ color: isDark ? "#9ca3af" : "#6b7280" }} />
                        <p className="text-sm font-medium" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>Click to upload image</p>
                        <p className="text-xs mt-1" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  )}
                  {imageError && uploadingImageId === section.id && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <span>{imageError}</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && uploadingImageId) {
                        handleImageUpload(uploadingImageId, file)
                      }
                      e.target.value = ""
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-4" style={{ minHeight: "60px" }}>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleAuthorEdit(e.currentTarget.textContent || "")}
            className="cursor-text text-2xl font-medium outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 rounded-md px-2 py-1"
            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
          >{slide.author}</div>
          <ArrowRight className="h-12 w-12 flex-shrink-0" strokeWidth={2.5} style={{ color: textColor }} />
        </div>
      </div>
    </div>
  )
}
