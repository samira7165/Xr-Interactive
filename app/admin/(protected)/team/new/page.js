import TeamMemberForm from '../TeamMemberForm'

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Add Team Member</h1>
      <TeamMemberForm />
    </div>
  )
}
