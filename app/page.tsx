// FILE: app/page.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Menu,
  Layers,
  Box,
  Paintbrush,
  FileText,
  LayoutGrid,
  Tag,
  MessageSquare,
  LogIn,
  Sun,
  HelpCircle,
  Book,
  Clock,
  Play,
  ChevronDown,
  Plus,
  MousePointer,
  BoxSelect,
  PenTool,
  Move,
  Spline,
  Circle,
  Type,
  Maximize2,
  Copy,
  Trash2,
  MessageCircleQuestion,
  PencilRuler,
  Scissors,
  Shapes,
} from 'lucide-react'

// A placeholder component to mimic the floor plans in your original screenshot
const FloorPlanPlaceholder = ({ className }: { className?: string }) => (
  <div
    className={`bg-white border border-gray-300 p-4 shadow-sm relative ${className}`}
  >
    <div className="w-full h-48 border-2 border-dashed border-gray-200 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Floor Plan Area</p>
    </div>
    <div className="absolute top-2 right-2 text-xs text-gray-500">
      Drawing.dwg
    </div>
  </div>
)

export default function HomePlanningPage() {
  return (
    <div className="flex h-screen w-full bg-[#212121] text-zinc-300 font-sans text-sm">
      {/* Left Sidebar */}
      <aside className="w-16 flex flex-col items-center justify-between py-4 bg-black/20 border-r border-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Layers className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Box className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Paintbrush className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <FileText className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Tag className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
            <LogIn className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
            <Sun className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
            <Book className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
            <MessageCircleQuestion className="h-5 w-5" />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-12 flex items-center justify-between px-4 border-b border-zinc-800 bg-[#212121] z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-green-500 flex items-center justify-center text-black font-bold text-lg">
              F
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Clock className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Play className="h-5 w-5" />
            </Button>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4">
              Share
            </Button>
          </div>
        </header>

        {/* Canvas Area */}
        <main className="flex-1 bg-[#E0E0E0] p-10 relative overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="border-b border-dashed border-gray-400 pb-2 mb-8">
              <p className="text-black text-sm">(1) Page</p>
            </div>
            <div className="grid grid-cols-2 gap-8 items-start">
              <FloorPlanPlaceholder />
              <FloorPlanPlaceholder />
              <FloorPlanPlaceholder className="col-span-2 max-w-[50%] justify-self-center" />
            </div>
          </div>

          {/* Bottom Floating Toolbar */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#2D2D2D] text-white rounded-lg shadow-2xl flex items-center p-1.5 gap-1 border border-zinc-700">
            <Button variant="ghost" size="icon" className="bg-blue-600/20 text-blue-400">
              <MousePointer className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <BoxSelect className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-zinc-700 mx-1" />
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <PenTool className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <PencilRuler className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-zinc-700 mx-1" />
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Spline className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Circle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Type className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-zinc-700 mx-1" />
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Move className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Maximize2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Shapes className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-zinc-700 mx-1" />
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Copy className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Scissors className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-700">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </main>
      </div>

      {/* Right Properties Panel */}
      <aside className="w-72 p-4 space-y-4 border-l border-zinc-800 bg-[#2D2D2D] text-sm overflow-y-auto">
        <Accordion type="multiple" defaultValue={['model', 'canvas']} className="w-full">
          <AccordionItem value="model">
            <AccordionTrigger>Model</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 p-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="model-name">Name</label>
                  <Input id="model-name" defaultValue="Home Planning" className="w-40" />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="model-owner">Owner</label>
                  <Input id="model-owner" defaultValue="fox" className="w-40" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="canvas">
            <AccordionTrigger>Model Canvas</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 p-1">
                <div className="flex items-center justify-between">
                  <label>Name</label>
                  <Input defaultValue="Top View of Ground floor" className="w-40" />
                </div>
                <div className="flex items-center justify-between">
                  <label>Active layer</label>
                  <Button variant="outline" className="border-zinc-700 bg-zinc-800 w-40 justify-between h-9">
                    <span>(1) Page</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <label>Wireframe</label>
                  <ToggleGroup type="single" defaultValue="off" className="h-9">
                    <ToggleGroupItem value="on" className="px-3">On</ToggleGroupItem>
                    <ToggleGroupItem value="off" className="px-3">Off</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex items-center justify-between">
                  <label>Grid</label>
                  <ToggleGroup type="single" defaultValue="hide" className="h-9">
                    <ToggleGroupItem value="show" className="px-3">Show</ToggleGroupItem>
                    <ToggleGroupItem value="hide" className="px-3">Hide</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex items-center justify-between">
                  <label>Unit</label>
                  <Button variant="outline" className="border-zinc-700 bg-zinc-800 w-40 justify-between h-9">
                    <span>Feet</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <label>Stroke scale</label>
                  <Input defaultValue="19/64&quot;" className="w-40" />
                </div>
                <div className="flex items-center justify-between">
                  <label>Background</label>
                  <div className="flex items-center h-9 px-2 rounded-md border border-zinc-700 bg-zinc-800">
                    <div className="w-5 h-5 bg-[#E0E0E0] rounded-sm border border-zinc-600" />
                    <span className="ml-2">#E0E0E0</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="custom">
            <AccordionTrigger>Custom properties</AccordionTrigger>
            <AccordionContent>
              <div className="text-center text-zinc-400 p-4">
                <p>No properties yet</p>
                <p className="text-xs">Create properties by clicking on the tag symbol.</p>
                <Button variant="link" className="text-blue-500 h-auto p-0 mt-2 text-xs">Learn more</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </aside>
    </div>
  )
}
