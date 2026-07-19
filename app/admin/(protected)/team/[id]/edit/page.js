import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TeamMemberForm from '../../TeamMemberForm'

export default async function EditTeamMemberPage({ params }) {
  const { id } = await params
  const member = await prisma.teamMember.findUnique({ where: { id: Number(id) } })

  if (!member) notFound()

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Edit Team Member</h1>
      <TeamMemberForm memberId={member.id} initialData={member} />
    </div>
  )
}
