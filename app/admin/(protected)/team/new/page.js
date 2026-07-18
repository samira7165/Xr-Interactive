import TeamMemberForm from '../TeamMemberForm'
import { createTeamMember } from '../actions'

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Add Team Member</h1>
      <TeamMemberForm action={createTeamMember} />
    </div>
  )
}
