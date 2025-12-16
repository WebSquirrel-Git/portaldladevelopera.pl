"use client"

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

type TooltipProps = {
  content: React.ReactNode
  children: React.ReactElement
  placement?: "top" | "bottom" | "left" | "right"
  delay?: number
  className?: string
}

// Pomocnicze typy do bezpiecznego wywoływania oryginalnych handlerów
type EventfulProps = {
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  onFocus?: (e: React.FocusEvent) => void
  onBlur?: (e: React.FocusEvent) => void
  onClick?: (e: React.MouseEvent) => void
}

function setRef<T>(ref: React.Ref<T> | undefined | null, value: T | null) {
  if (!ref) return
  if (typeof ref === "function") {
    ref(value)
  } else {
    try {
      ;(ref as React.MutableRefObject<T | null>).current = value
    } catch {
      // noop
    }
  }
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 100,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  )
  const id = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const clearDelay = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const show = () => {
    clearDelay()
    timeoutRef.current = window.setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    clearDelay()
    setOpen(false)
  }
  const toggleClick = (e: React.MouseEvent) => {
    // mobile/touch-friendly toggle
    e.preventDefault()
    e.stopPropagation()
    setOpen((o) => !o)
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return
      const trg = triggerRef.current
      const tip = tooltipRef.current
      if (!trg || !tip) return setOpen(false)
      if (!trg.contains(e.target as Node) && !tip.contains(e.target as Node))
        setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("click", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("click", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const trg = triggerRef.current
    const tip = tooltipRef.current
    if (!trg || !tip) return
    const rect = trg.getBoundingClientRect()
    const tipRect = tip.getBoundingClientRect()

    let top = 0
    let left = 0

    const gap = 8
    switch (placement) {
      case "bottom":
        top = rect.bottom + gap
        left = rect.left + rect.width / 2 - tipRect.width / 2
        break
      case "left":
        top = rect.top + rect.height / 2 - tipRect.height / 2
        left = rect.left - tipRect.width - gap
        break
      case "right":
        top = rect.top + rect.height / 2 - tipRect.height / 2
        left = rect.right + gap
        break
      default: // top
        top = rect.top - tipRect.height - gap
        left = rect.left + rect.width / 2 - tipRect.width / 2
    }

    // viewport clamp
    const vw = window.innerWidth
    const vh = window.innerHeight
    if (left < 8) left = 8
    if (left + tipRect.width > vw - 8) left = vw - tipRect.width - 8
    if (top < 8) top = rect.bottom + gap // flip to bottom if not enough space above
    if (top + tipRect.height > vh - 8)
      top = Math.max(8, vh - tipRect.height - 8)

    setCoords({
      top: Math.round(top + window.scrollY),
      left: Math.round(left + window.scrollX),
    })
  }, [open, placement, content])

  // Bezpiecznie obsłuż oryginalne handlery i ref dziecka
  const originalHandlers = (children.props || {}) as Partial<EventfulProps>
  type ElementWithRef = React.ReactElement & {
    ref?: React.Ref<HTMLElement> | null
  }
  const childWithRef = children as ElementWithRef

  const childProps: Record<string, unknown> = {
    ref: (el: HTMLElement | null) => {
      triggerRef.current = el
      setRef(childWithRef.ref, el)
    },
    onMouseEnter: (e: React.MouseEvent) => {
      originalHandlers.onMouseEnter?.(e)
      show()
    },
    onMouseLeave: (e: React.MouseEvent) => {
      originalHandlers.onMouseLeave?.(e)
      hide()
    },
    onFocus: (e: React.FocusEvent) => {
      originalHandlers.onFocus?.(e)
      show()
    },
    onBlur: (e: React.FocusEvent) => {
      originalHandlers.onBlur?.(e)
      hide()
    },
    onClick: (e: React.MouseEvent) => {
      originalHandlers.onClick?.(e)
      toggleClick(e)
    },
    "aria-describedby": open ? id : undefined,
  }

  const cloned = React.cloneElement(children, childProps)

  return (
    <>
      {cloned}
      {open
        ? createPortal(
            <div
              id={id}
              role="tooltip"
              ref={tooltipRef}
              style={{
                top: coords?.top ?? 0,
                left: coords?.left ?? 0,
                zIndex: 9999,
                position: "absolute",
                visibility: coords ? "visible" : "hidden",
              }}
              className={
                // pointer-events-auto + overflow-auto + max-h, aby długie treści nie były ucinane
                "pointer-events-auto select-text rounded-md border border-black/10 bg-white text-black shadow-lg px-3 py-2 text-xs whitespace-pre-line max-w-[360px] max-h-[60vh] overflow-auto break-words " +
                (className || "")
              }
            >
              {content}
            </div>,
            document.body
          )
        : null}
    </>
  )
}

export function InfoTooltip({
  text,
  ariaLabel,
}: {
  text: string
  ariaLabel?: string
}) {
  return (
    <Tooltip content={text}>
      <button
        type="button"
        aria-label={ariaLabel || "Więcej informacji"}
        className="inline-flex items-center justify-center align-middle ml-1 w-[16px] h-[16px] rounded-full border border-gray-400 text-[11px] leading-none text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        i
      </button>
    </Tooltip>
  )
}
