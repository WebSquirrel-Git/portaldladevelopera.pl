"use client"

import { useRouter } from "next/navigation"
import { Tooltip } from "./Tooltip"

export default function BackButton({
  label = "Powrót",
  className = "",
}: {
  label?: string
  className?: string
}) {
  const router = useRouter()
  return (
    <Tooltip content={label}>
      <button
        onClick={() => router.back()}
        className={`btn px-2 py-1 text-xs ${className}`}
        aria-label={label}
      >
        <span aria-hidden>←</span>
        <span className="ml-1.5">{label}</span>
      </button>
    </Tooltip>
  )
}
