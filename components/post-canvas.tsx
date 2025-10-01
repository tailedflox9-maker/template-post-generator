"use client"

import { useState, useRef, CSSProperties } from "react"
import type { Slide } from "@/app/page"
import { ArrowRight, X, ChevronUp, ChevronDown, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostCanvasProps {
  slide: Slide
  onUpdateSection: (sectionId: string, content: string) => void
  onUpdateAuthor: (author: string) => void
  onDeleteSection: (sectionId: string) => void
  onMoveSection: (sectionId: string, direction: "up" | "down") => void
}

const getBackgroundStyle = (background: string): CSSProperties => {
  const baseStyle: CSSProperties = {}
  
  switch (background) {
    case "white":
      baseStyle.backgroundColor = "#ffffff"
      break
    case "cream":
      baseStyle.backgroundColor = "#fef9f3"
      break
    case "lightGray":
      baseStyle.backgroundColor = "#f5f5f5"
      break
    case "lightBlue":
      baseStyle.backgroundColor = "#eff6ff"
      break
    case "grainy":
      baseStyle.backgroundColor = "#f8f8f8"
      baseStyle.backgroundImage = "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.03) 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.03) 3px)"
      break
    case "dots":
      baseStyle.backgroundColor = "#fafafa"
      baseStyle.backgroundImage = "radial-gradient(circle at center, rgba(0,0,0,0.08) 1px, transparent 1px)"
      baseStyle.backgroundSize = "20px 20px"
      break
    case "darkGray":
      baseStyle.backgroundColor = "#1f2937"
      break
    case "darkBlue":
      baseStyle.backgroundColor = "#1e3a8a"
      break
    case "black":
      baseStyle.backgroundColor = "#0a0a0a"
      break
    default:
      baseStyle.backgroundColor = "#ffffff"
  }
  
  return baseStyle
}

const isDarkBackground = (background: string) => {
  return ["darkGray", "darkBlue", "black"].includes(background)
}

export function PostCanvas({
  slide,
  onUpdateSection,
  onUpdateAuthor,
  onDeleteSection,
  onMoveSection,
}: PostCanvasProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null)

  const isDark = isDarkBackground(slide.background)
  const textColor = isDark ? "#ffffff" : "#1f2937"
  const borderColor = isDark ? "#4b5563" : "#1f2937"

  const handleImageUpload = (sectionId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      onUpdateSection(sectionId, imageUrl)
    }
    reader.readAsDataURL(file)
  }

  const titleStyle: CSSProperties = {
    color: textColor,
  }

  const labelBoxStyle = (section: any): CSSProperties => ({
    backgroundColor: section.style?.backgroundColor || "#3B82F6",
    color: section.style?.textColor || "#FFFFFF",
  })

  const textBoxStyle: CSSProperties = {
    borderColor: borderColor,
    color: textColor,
  }

  return (
    <div
      id="post-canvas"
      className="relative aspect-square w-full rounded-lg border-2 border-gray-300 p-12 shadow-xl bg-white"
      style={getBackgroundStyle(slide.background)}
    >
      <div className="flex h-full flex-col gap-6">
        {slide.sections.map((section, index) => (
          <div key={section.id} className="group relative">
            {editingId !== section.id && (
              <div className="absolute -left-10 top-0 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {index > 0 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => onMoveSection(section.id, "up")}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                )}
                {index < slide.sections.length - 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => onMoveSection(section.id, "down")}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {editingId !== section.id && section.type !== "title" && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute -right-2 -top-2 z-10 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onDeleteSection(section.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {section.type === "title" && (
              <div
                contentEditable
                suppressContentEditableWarning
                onFocus={() => setEditingId(section.id)}
                onBlur={(e) => {
                  setEditingId(null)
                  onUpdateSection(section.id, e.currentTarget.textContent || "")
                }}
                className="cursor-text text-balance text-5xl font-bold leading-tight outline-none focus:ring-2 focus:ring-blue-500"
                style={titleStyle}
              >
                {section.content}
              </div>
            )}

            {section.type === "label-box" && (
              <div
                contentEditable
                suppressContentEditableWarning
                onFocus={() => setEditingId(section.id)}
                onBlur={(e) => {
                  setEditingId(null)
                  onUpdateSection(section.id, e.currentTarget.textContent || "")
                }}
                className="inline-block cursor-text rounded-md px-6 py-3 text-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                style={labelBoxStyle(section)}
              >
                {section.content}
              </div>
            )}

            {section.type === "text-box" && (
              <div
                contentEditable
                suppressContentEditableWarning
                onFocus={() => setEditingId(section.id)}
                onBlur={(e) => {
                  setEditingId(null)
                  onUpdateSection(section.id, e.currentTarget.textContent || "")
                }}
                className="cursor-text rounded-lg border-2 p-6 text-lg leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-start"
                style={textBoxStyle}
              >
                {section.content}
              </div>
            )}

            {section.type === "image" && (
              <div className="relative">
                {section.content ? (
                  <img
                    src={section.content}
                    alt="Uploaded content"
                    className="max-h-64 w-full rounded-lg object-contain"
                  />
                ) : (
                  <div
                    className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-blue-500"
                    style={{
                      borderColor: isDark ? "#4b5563" : "#d1d5db",
                      backgroundColor: isDark ? "#374151" : "#f9fafb",
                    }}
                    onClick={() => {
                      setUploadingImageId(section.id)
                      fileInputRef.current?.click()
                    }}
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8" style={{ color: isDark ? "#9ca3af" : "#6b7280" }} />
                      <p className="mt-2 text-sm" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                        Click to upload image
                      </p>
                    </div>
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
                      setUploadingImageId(null)
                    }
                  }}
                />
              </div>
            )}
          </div>
        ))}

        <div className="flex-1" />

        <div className="flex items-end justify-between">
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateAuthor(e.currentTarget.textContent || "")}
            className="cursor-text text-2xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
          >
            {slide.author}
          </div>
          <ArrowRight className="h-12 w-12" strokeWidth={2.5} style={{ color: textColor }} />
        </div>
      </div>
    </div>
  )
}
