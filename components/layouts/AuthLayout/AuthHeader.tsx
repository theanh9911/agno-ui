import React from 'react'
import Heading from '@/components/ui/typography/Heading'
import Image from '@/components/ui/Image'

const AuthHeader = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <Image
        alt="Agnos Logo"
        src={'/icons/agno_logo.svg'}
        width={0}
        height={0}
        className="size-[59.29px]"
        priority
      />

      <Heading size={1} className="text-muted">
        Build, ship and monitor high performance{' '}
        <span className="text-brand"> Agentic Systems</span>
      </Heading>
    </div>
  )
}

export default AuthHeader
