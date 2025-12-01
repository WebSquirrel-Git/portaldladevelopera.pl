'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import React from 'react'

export const Pagination: React.FC<{
  className?: string
  page: number | undefined
  totalPages: number
}> = ({ className, page, totalPages }) => {
  const router = useRouter()
  if (!page) return
  const goToPage = (p: number) => {
    const params = new URLSearchParams(window.location.search)

    if (p === 1) params.delete('page')
    else params.set('page', p.toString())

    const queryString = params.toString()

    router.replace(`/blog${queryString ? `?${queryString}` : ''}`, { scroll: false })
    router.refresh() // ⬅⬅⬅ wymusza pobranie nowych danych z SSR
  }

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const prevPage = page - 1
  const nextPage = page + 1
  const next2Page = page + 2

  const showPrevNumber = prevPage >= 1
  const showNextNumber = nextPage <= totalPages
  const showNext2Number = next2Page <= totalPages
  const showEllipsis = next2Page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          {/* Prev button */}
          <PaginationItem>
            <PaginationPrevious disabled={!hasPrevPage} onClick={() => goToPage(page - 1)} />
          </PaginationItem>

          {/* Previous page */}
          {showPrevNumber && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(prevPage)}>{prevPage}</PaginationLink>
            </PaginationItem>
          )}

          {/* Current page */}
          <PaginationItem>
            <PaginationLink isActive onClick={() => goToPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {/* Next page */}
          {showNextNumber && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(nextPage)}>{nextPage}</PaginationLink>
            </PaginationItem>
          )}

          {/* Next 2 page */}
          {showNext2Number && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(next2Page)}>{next2Page}</PaginationLink>
            </PaginationItem>
          )}

          {/* Ellipsis */}
          {showEllipsis && (
            <span
              className="flex items-center rounded-lg text-lightGrey justify-center 
              p-0 w-10 text-[16px] h-10 list-none bg-darkGrey border border-solid border-white/10"
            >
              ...
            </span>
          )}

          {/* Last page */}
          {totalPages > next2Page && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
          )}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext disabled={!hasNextPage} onClick={() => goToPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
