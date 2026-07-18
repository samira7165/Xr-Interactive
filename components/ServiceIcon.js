import * as icons from 'lucide-react'

export default function ServiceIcon({ name, size = 40, ...props }) {
  const Icon = icons[name]
  if (!Icon) return null
  return <Icon size={size} {...props} />
}
