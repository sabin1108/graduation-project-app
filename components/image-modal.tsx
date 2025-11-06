"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
  link?: string
}

export default function ImageModal({ isOpen, onClose, imageUrl, link }: ImageModalProps) {
  const handleImageClick = () => {
    if (link) {
      window.open(link, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <img
          src={imageUrl}
          alt="Enlarged image"
          className={`w-full h-auto ${link ? "cursor-pointer" : ""}`.trim()}
          onClick={handleImageClick}
        />
      </DialogContent>
    </Dialog>
  )
}

