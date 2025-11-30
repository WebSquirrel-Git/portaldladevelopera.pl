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
  page: number
  totalPages: number
}> = ({ className, page, totalPages }) => {
  const router = useRouter()

  const goToPage = (p: number) => {
    if (p === 1) router.push('/blog')
    else router.push(`/blog/page/${p}`)
  }

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  // Wyliczamy potencjalne numery stron
  const prevPage = page - 1
  const nextPage = page + 1
  const next2Page = page + 2

  const showPrevNumber = prevPage >= 1
  const showNextNumber = nextPage <= totalPages
  const showNext2Number = next2Page <= totalPages

  // Czy pokazać ellipsis?
  // Pokazujemy TYLKO jeśli current+2 < lastPage (czyli jest odstęp)
  const showEllipsis = next2Page < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>

          {/* Prev button */}
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              onClick={() => goToPage(page - 1)}
            />
          </PaginationItem>

          {/* Previous page */}
          {showPrevNumber && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(prevPage)}>
                {prevPage}
              </PaginationLink>
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
              <PaginationLink onClick={() => goToPage(nextPage)}>
                {nextPage}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Next 2 page */}
          {showNext2Number && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(next2Page)}>
                {next2Page}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Ellipsis if needed */}
          {showEllipsis && (
            <span className="flex items-center rounded-lg text-lightGrey justify-center 
              p-0 w-10 text-[16px] h-10 list-none bg-darkGrey border border-solid border-white/10">
              ...
            </span>
          )}

          {/* Last page */}
          {page !== totalPages && next2Page < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              disabled={!hasNextPage}
              onClick={() => goToPage(page + 1)}
            />
          </PaginationItem>

        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
