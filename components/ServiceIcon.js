import { Glasses, Gamepad2, PartyPopper, Globe, Sparkles, Radio } from 'lucide-react'

const icons = {
  Glasses,
  Gamepad2,
  PartyPopper,
  Globe,
  Sparkles,
  Radio,
}

export default function ServiceIcon({ name, size = 40, ...props }) {
  const Icon = icons[name]
  if (!Icon) return null
  return <Icon size={size} {...props} />
}