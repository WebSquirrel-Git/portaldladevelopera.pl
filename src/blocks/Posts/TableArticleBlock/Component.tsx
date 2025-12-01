export interface TableArticleBlockPropsType {
  header: string
  headerSize: 'h2' | 'h3'
  navPoint: number
  table: {
    header: string
    rows: {
      row: string
    }[]
  }[]
}

export const TableArticleBlock: React.FC<TableArticleBlockPropsType> = (props) => {
  const { header, headerSize, navPoint, table } = props

  const rowCount = Math.max(...table.map((col) => col.rows.length))

  return (
    <div
      id={`${navPoint}`}
      className="flex flex-col gap-[18px] xl:gap-[20px] px-3 xl:px-16 py-[18px] xl:py-[20px]"
    >
      {headerSize === 'h2' && <h2 className="text-white text-left">{header}</h2>}
      {headerSize === 'h3' && <h3 className="text-white text-left">{header}</h3>}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-700">
          <thead>
            <tr>
              {table.map((col, i) => (
                <th
                  key={i}
                  className={`${i === 0 && 'border-l-0 pl-0'} font-semibold border pl-[20px] text-left border-white border-solid border-t-0 border-r-0 text-[14px] leading-[34px] text-lightGrey`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {table.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`${colIndex === 0 && 'border-l-0 pl-0'} ${rowIndex === 0 ? 'pt-3' : 'pt-0'} whitespace-nowrap border pl-[20px] text-left border-white border-solid border-t-0 border-b-0 border-r-0 text-[14px] leading-[34px] text-lightGrey`}
                  >
                    {col.rows[rowIndex]?.row ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
