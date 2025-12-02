import { type FC } from 'react'

import { cn } from '@/utils/cn'

import { type LoadingSpinnerProps } from './types'

const ANIMATION_DURATION = '1.8s'

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ className }) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('stroke-secondary-500 mx-auto mt-20 size-20', className)}
  >
    <g fill="none" fillRule="evenodd" strokeWidth="2">
      <circle cx="22" cy="22" r="1">
        <animate
          attributeName="r"
          begin="0s"
          dur={ANIMATION_DURATION}
          values="1; 20"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.165, 0.84, 0.44, 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="strokeOpacity"
          begin="0s"
          dur={ANIMATION_DURATION}
          values="1; 0"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.3, 0.61, 0.355, 1"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="22" cy="22" r="1">
        <animate
          attributeName="r"
          begin="-0.9s"
          dur={ANIMATION_DURATION}
          values="1; 20"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.165, 0.84, 0.44, 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="strokeOpacity"
          begin="-0.9s"
          dur={ANIMATION_DURATION}
          values="1; 0"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.3, 0.61, 0.355, 1"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
)

export default LoadingSpinner
