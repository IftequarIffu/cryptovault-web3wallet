import React, { ReactNode } from 'react'

const OnboardingLayout = ({ children }: {children: ReactNode }) => {
  return (
    <div className="w-3/5 p-4 ">{children}</div>
  )
}

export default OnboardingLayout