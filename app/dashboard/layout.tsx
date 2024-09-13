import React, { ReactNode } from 'react'

const DashboardLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className="w-3/5 p-4 ">{children}</div>
  )
}

export default DashboardLayout