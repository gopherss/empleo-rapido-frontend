import type { ApplicationStatus, JobStatus } from '@/types/api'

interface ApplicationFlowProps {
  status: ApplicationStatus
  jobStatus: JobStatus
}

interface Point {
  x: number
  y: number
}

const NODES = {
  sent: { x: 30, y: 70 },
  review: { x: 160, y: 70 },
  accepted: { x: 290, y: 70 },
  completed: { x: 420, y: 70 },
  rejected: { x: 290, y: 20 },
  withdrawn: { x: 290, y: 120 },
} satisfies Record<string, Point>

const EDGES = {
  sentReview: 'M30,70 L160,70',
  reviewAccepted: 'M160,70 L290,70',
  acceptedCompleted: 'M290,70 L420,70',
  reviewRejected: 'M160,70 C220,70 230,20 290,20',
  reviewWithdrawn: 'M160,70 C220,70 230,120 290,120',
}

const NODE_LABELS: Record<keyof typeof NODES, string> = {
  sent: 'Enviada',
  review: 'En revision',
  accepted: 'Aceptada',
  completed: 'Finalizado',
  rejected: 'Rechazada',
  withdrawn: 'Retirada',
}

const LABEL_POSITION: Record<keyof typeof NODES, Point> = {
  sent: { x: 30, y: 94 },
  review: { x: 160, y: 94 },
  accepted: { x: 290, y: 94 },
  completed: { x: 420, y: 94 },
  rejected: { x: 290, y: 12 },
  withdrawn: { x: 290, y: 140 },
}

type Tone = 'success' | 'destructive' | 'muted' | 'primary'

const TONE_STROKE: Record<Tone, string> = {
  success: 'stroke-success',
  destructive: 'stroke-destructive',
  muted: 'stroke-muted-foreground',
  primary: 'stroke-primary',
}

const TONE_FILL: Record<Tone, string> = {
  success: 'fill-success',
  destructive: 'fill-destructive',
  muted: 'fill-muted-foreground',
  primary: 'fill-primary',
}

const TONE_TEXT: Record<Tone, string> = {
  success: 'fill-success',
  destructive: 'fill-destructive',
  muted: 'fill-muted-foreground',
  primary: 'fill-primary',
}

interface Stage {
  tone: Tone
  reached: (keyof typeof NODES)[]
  activeEdges: (keyof typeof EDGES)[]
  current: keyof typeof NODES
}

function resolveStage(
  status: ApplicationStatus,
  jobStatus: JobStatus,
): Stage {
  if (status === 'REJECTED') {
    return {
      tone: 'destructive',
      reached: ['sent', 'review', 'rejected'],
      activeEdges: ['sentReview', 'reviewRejected'],
      current: 'rejected',
    }
  }

  if (status === 'WITHDRAWN') {
    return {
      tone: 'muted',
      reached: ['sent', 'review', 'withdrawn'],
      activeEdges: ['sentReview', 'reviewWithdrawn'],
      current: 'withdrawn',
    }
  }

  if (status === 'PENDING') {
    return {
      tone: 'primary',
      reached: ['sent', 'review'],
      activeEdges: ['sentReview'],
      current: 'review',
    }
  }

  if (jobStatus === 'COMPLETED') {
    return {
      tone: 'success',
      reached: ['sent', 'review', 'accepted', 'completed'],
      activeEdges: ['sentReview', 'reviewAccepted', 'acceptedCompleted'],
      current: 'completed',
    }
  }

  return {
    tone: 'success',
    reached: ['sent', 'review', 'accepted'],
    activeEdges: ['sentReview', 'reviewAccepted'],
    current: 'accepted',
  }
}

export function ApplicationFlow({ status, jobStatus }: ApplicationFlowProps) {
  const stage = resolveStage(status, jobStatus)
  const reachedSet = new Set(stage.reached)
  const activeEdgeSet = new Set(stage.activeEdges)
  const current = NODES[stage.current]

  const nodeKeys = Object.keys(NODES) as (keyof typeof NODES)[]
  const edgeKeys = Object.keys(EDGES) as (keyof typeof EDGES)[]

  return (
    <svg
      viewBox="0 0 460 150"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Estado de la postulacion: ${NODE_LABELS[stage.current]}`}
      className="h-[150px] w-full max-w-[520px]"
    >
      {edgeKeys.map((edge) => {
        const active = activeEdgeSet.has(edge)
        const isMain = edge === 'sentReview'
        const tone = isMain ? 'primary' : stage.tone
        return (
          <path
            key={edge}
            d={EDGES[edge]}
            fill="none"
            strokeWidth={2}
            strokeDasharray={active || isMain ? undefined : '4 4'}
            className={
              active || isMain ? TONE_STROKE[tone] : 'stroke-border'
            }
          />
        )
      })}

      {nodeKeys.map((node) => {
        const reached = reachedSet.has(node)
        const tone = node === 'sent' || node === 'review' ? 'primary' : stage.tone
        return (
          <circle
            key={node}
            cx={NODES[node].x}
            cy={NODES[node].y}
            r={8}
            strokeWidth={2}
            className={
              reached
                ? TONE_FILL[tone]
                : 'fill-background stroke-border'
            }
          />
        )
      })}

      {nodeKeys.map((node) => {
        const reached = reachedSet.has(node)
        const tone = node === 'sent' || node === 'review' ? 'primary' : stage.tone
        return (
          <text
            key={node}
            x={LABEL_POSITION[node].x}
            y={LABEL_POSITION[node].y}
            textAnchor="middle"
            fontSize={11}
            className={reached ? TONE_TEXT[tone] : 'fill-muted-foreground'}
          >
            {NODE_LABELS[node]}
          </text>
        )
      })}

      <circle
        cx={current.x}
        cy={current.y}
        r={9}
        fill="none"
        strokeWidth={2}
        className={TONE_STROKE[stage.tone]}
      >
        <animate
          attributeName="r"
          values="9;18;9"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}
