import PortfolioItemForm from '../PortfolioItemForm'
import { createItem } from '../actions'

export default function NewPortfolioItemPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>New Portfolio Item</h1>
      <PortfolioItemForm action={createItem} />
    </div>
  )
}
