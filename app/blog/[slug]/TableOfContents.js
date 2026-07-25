'use client'

import { useEffect, useState } from 'react'

export default function TableOfContents({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(entry => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )

    sections.forEach(section => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  if (sections.length === 0) return null

  return (
    <div>
      <div className="blog-toc-label">In this Article</div>
      <nav className="blog-toc">
        {sections.map((section, i) => (
          <a key={section.id} href={`#${section.id}`} className={activeId === section.id ? 'active' : ''}>
            <span className="dot" />
            {i + 1}. {section.heading}
          </a>
        ))}
      </nav>
    </div>
  )
}
