'use client'

import { useRef, CSSProperties } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null)
  const duplicateRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current || !duplicateRef.current) return

    // Modifies the CSS variable --xpercent
    const xTo = gsap.quickTo(duplicateRef.current, '--xpercent', {
      duration: 0.4, // Changes over 0.4s
      ease: 'back', // With a slight bounce at the end of the movement
    })

    // Modifies the CSS variable --ypercent
    const yTo = gsap.quickTo(duplicateRef.current, '--ypercent', {
      duration: 0.4, // Changes over 0.4s
      ease: 'back', // With a slight bounce at the end of the movement
    })

    const handleMouseMove = (e: MouseEvent) => {
      // Maps the mouse's X position from the window width range (0 to innerWidth)
      // to a normalized range (0 to 100)
      const mRangeX = gsap.utils.mapRange(0, window.innerWidth, 0, 100, e.clientX)

      // Update the X position smoothly
      xTo(mRangeX)

      // Maps the mouse's Y position relative to the element's bounding box
      // to a normalized range (0 to 100)
      const bound = (e.target as HTMLElement).getBoundingClientRect()
      const mRangeY = gsap.utils.mapRange(bound.top, bound.top + bound.height, 0, 100, e.clientY)

      // Update the Y position smoothly
      yTo(mRangeY)
    }

    sectionRef.current.addEventListener('mousemove', handleMouseMove)

    return () => {
      sectionRef.current?.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-foreground text-background pb-10">
      <div className="relative">
        <div className="relative pointer-events-none">
          {/* Original Container */}
          <div className="relative px-[25px] h-screen flex flex-col justify-end">
            {/* Header */}
            <div className="flex justify-between w-full py-[25px]">
              <p className="uppercase tracking-[-0.01em] text-base">Davinci Store®</p>
              <p className="uppercase tracking-[-0.01em] text-base">Shop, About</p>
              <p className="uppercase tracking-[-0.01em] text-base">New Arrivals</p>
              <p className="uppercase tracking-[-0.01em] text-base">Contact</p>
            </div>

            <div>
              {/* Line 1 */}
              <div className="flex items-center justify-between">
                <p className="font-medium text-[10.5vw] leading-[0.9] tracking-[-0.05em] uppercase -ml-[0.07em]">
                  Ready to
                </p>
              </div>

              {/* Line 2 */}
              <div className="flex items-center justify-between">
                <p className="font-medium text-[10.5vw] leading-[0.9] tracking-[-0.05em] uppercase -ml-[0.07em]">
                  Elevate your
                </p>
                <img
                  className="w-[11.2vw] aspect-[1.5] object-cover -translate-y-[5%] rounded-[0.5vw]"
                  src="/scroll/1.png"
                  alt=""
                />
                <p className="font-medium text-[10.5vw] leading-[0.9] tracking-[-0.05em] uppercase">
                  style?
                </p>
              </div>

              {/* Line 3 */}
              <div className="flex items-center justify-between">
                <svg
                  className="w-[7.8vw] h-auto"
                  fill="none"
                  height="115"
                  viewBox="0 0 118 115"
                  width="118"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="currentColor">
                    <path d="m76.5346 31.8467 41.4654 41.5767-41.4654 41.5766h-18.429l33.9984-34.0896h-92.0658671v-14.974h92.0658671l-33.9984-34.0897z" />
                    <path d="m.00000377 80.7447-.00000377-80.74469922 14.6416-.00000078v80.7447z" />
                  </g>
                </svg>

                <p className="font-medium text-[10.5vw] leading-[0.9] tracking-[-0.05em] uppercase">
                  Shop now
                </p>
              </div>
            </div>
          </div>

          {/* Duplicate Container with Mask Effect */}
          <div
            ref={duplicateRef}
            className="absolute top-0 left-0 w-full text-[#8B5B29] px-[25px] h-screen flex flex-col justify-end"
            style={
              {
                '--xpercent': '50%',
                '--ypercent': '50%',
                maskImage:
                  'radial-gradient(circle at var(--xpercent) var(--ypercent), #000 20%, transparent 25%)',
                WebkitMaskImage:
                  'radial-gradient(circle at var(--xpercent) var(--ypercent), #000 20%, transparent 25%)',
              } as CSSProperties
            }
            aria-hidden="true"
          >
            {/* Header */}
            <div className="flex justify-between w-full py-[25px]">
              <p className="uppercase tracking-[-0.01em] text-base">Davinci Store®</p>
              <p className="uppercase tracking-[-0.01em] text-base">Shop, About</p>
              <p className="uppercase tracking-[-0.01em] text-base">New Arrivals</p>
              <p className="uppercase tracking-[-0.01em] text-base">Contact</p>
            </div>

            <div>
              {/* Line 1 */}
              <div className="flex items-center justify-between">
                <p className="font-medium text-[10.5vw] leading-[0.9] tracking-[-0.05em] uppercase -ml-[0.07em]">
                  Ready to
                </p>
              </div>

              {/* Line 2 */}
              <div className="flex items-center justify-between">
                <p className="font-medium text-[10.5vw] leading-[0.9] tracking-[-0.05em] uppercase -ml-[0.07em]">
                  Elevate your
                </p>
                <img
                  className="w-[11.2vw] aspect-[1.5] object-cover -translate-y-[5%] rounded-[0.5vw]"
                  src="/scroll/2.png"
                  alt=""
                />
                <p className="font-medium text-[10.5vw] leading-[0.9] tracking-[-0.05em] uppercase">
                  style?
                </p>
              </div>

              {/* Line 3 */}
              <div className="flex items-center justify-between">
                <svg
                  className="w-[7.8vw] h-auto"
                  fill="none"
                  height="115"
                  viewBox="0 0 118 115"
                  width="118"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="currentColor">
                    <path d="m76.5346 31.8467 41.4654 41.5767-41.4654 41.5766h-18.429l33.9984-34.0896h-92.0658671v-14.974h92.0658671l-33.9984-34.0897z" />
                    <path d="m.00000377 80.7447-.00000377-80.74469922 14.6416-.00000078v80.7447z" />
                  </g>
                </svg>

                <p className="font-medium text-[10.5vw] leading-[0.9] tracking-[-0.05em] uppercase">
                  Shop now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
