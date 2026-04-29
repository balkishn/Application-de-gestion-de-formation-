// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { formationApi } from '@/lib/api'
import { useDashboardData } from '@/hooks/useDashboardData'
import type {
  CompletionItem,
  DirectionBreakdown,
  DomainBreakdown,
  FormationItem,
  MonthlySeries,
  OverviewData,
  CalendarFormation,
} from './types'
import {
  AMBER,
  BG,
  BLUE,
  G1,
  MONTHS_FR,
  MUTED,
  ROSE,
  TEAL,
  TEXT,
  buildDirectionBreakdown,
  buildDomainBreakdown,
  deriveFormationsData,
} from './helpers'
import { Bloom } from './widgets/bloom'
import { CompletionBars } from './widgets/completion-bars'
import { CostChart } from './widgets/cost-chart'
import { DirectionBars, DirectionBarsExpanded } from './widgets/direction-bars'
import { DomaineDonut } from './widgets/domaine-donut'
import { FiveYearStatsChart } from './widgets/five-year-stats-chart'
import { FormationCalendar } from './widgets/formation-calendar'
import { KPIBadge } from './widgets/kpi-badge'
import { Card, Particles, Title } from './widgets/primitives'

export default function FormationsDashboard() {
  const currentYear = new Date().getFullYear()
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardData()
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [domaines, setDomaines] = useState<DomainBreakdown[]>([])
  const [directions, setDirections] = useState<DirectionBreakdown[]>([])
  const [formations, setFormations] = useState<FormationItem[]>([])
  const [completionItems, setCompletionItems] = useState<CompletionItem[]>([])
  const [calendarFormations, setCalendarFormations] = useState<CalendarFormation[]>([])
  const [monthlyCosts, setMonthlyCosts] = useState<number[]>(Array(12).fill(0))
  const [monthlySeries, setMonthlySeries] = useState<MonthlySeries[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null)

  useEffect(() => {
    if (!dashboardData) return
    setOverview(dashboardData.overview || null)
    setDomaines(buildDomainBreakdown(dashboardData.formationsParDomaine))
    setDirections(buildDirectionBreakdown(dashboardData.participantsParStructure))
  }, [dashboardData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const formationsData = await formationApi.getAll()
        setFormations(Array.isArray(formationsData) ? formationsData : [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const derived = deriveFormationsData(formations, currentYear)
    setCompletionItems(derived.completionItems)
    setCalendarFormations(derived.calendarFormations)
    setMonthlyCosts(derived.monthlyCosts)
    setMonthlySeries(derived.monthlySeries)
  }, [formations, currentYear])

  const realizedCount = calendarFormations.filter((item) => item.status === 'past').length
  const plannedCount = calendarFormations.filter((item) => item.status !== 'past').length
  const annualCostTotal = monthlyCosts.reduce((sum, value) => sum + Number(value || 0), 0)

  const renderExpandedWidget = () => {
    if (!expandedWidget) return null

    const widgetContent: Record<string, { title: string; node: React.ReactNode }> = {
      structures: { title: 'Participants par structure', node: <DirectionBarsExpanded directions={directions} /> },
      cost: {
        title: 'Cout mensuel des formations',
        node: (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: MUTED }}>Total annuel ({currentYear})</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: AMBER }}>{annualCostTotal.toLocaleString('fr-FR')} Dt</div>
            </div>
            <CostChart monthlyCosts={monthlyCosts} expanded />
          </div>
        ),
      },
      completion: { title: 'Taux de completion', node: <CompletionBars items={completionItems} expanded /> },
      calendar: { title: 'Planning formations', node: <FormationCalendar formations={calendarFormations} expanded /> },
      line: { title: 'Statistiques des formations sur 5 ans', node: <FiveYearStatsChart series={monthlySeries} expanded /> },
    }

    const selectedWidget = widgetContent[expandedWidget]
    if (!selectedWidget) return null

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 23, 15, 0.5)', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1.5px solid #dcfce7', width: 'min(1100px, 95vw)', maxHeight: '90vh', overflow: 'auto', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#15803d' }}>{selectedWidget.title}</div>
            <button onClick={() => setExpandedWidget(null)} style={{ background: 'none', border: '1px solid #bbf7d0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, color: '#15803d' }}>Fermer</button>
          </div>
          {selectedWidget.node}
        </div>
      </div>
    )
  }

  if (loading || dashboardLoading) {
    return (
      <div style={{ background: BG, minHeight: '100vh', padding: '18px 16px', fontFamily: "'Segoe UI',system-ui,sans-serif", color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, color: MUTED }}>Chargement du tableau de bord...</div>
      </div>
    )
  }

  if (error || dashboardError) {
    return (
      <div style={{ background: BG, minHeight: '100vh', padding: '18px 16px', fontFamily: "'Segoe UI',system-ui,sans-serif", color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, color: ROSE }}>Erreur: {error || dashboardError}</div>
      </div>
    )
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', padding: '18px 16px', fontFamily: "'Segoe UI',system-ui,sans-serif", color: TEXT, position: 'relative' }}>
      <style>{`
        @keyframes barRise{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .r1{animation:fadeUp .4s .05s both}.r2{animation:fadeUp .4s .15s both}
        .r3{animation:fadeUp .4s .25s both}.r4{animation:fadeUp .4s .35s both}
        button:focus{outline:none}
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}><Particles /></div>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.45, backgroundImage: 'radial-gradient(circle,#bbf7d0 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 12 }} className="r1">
          <KPIBadge icon="📚" label="Formations" value={overview?.totalFormations || 0} sub="formations totales" color={G1} />
          <KPIBadge icon="👥" label="Participants" value={overview?.totalParticipants || 0} sub="inscrits cette annee" color={TEAL} />
          <KPIBadge icon="🧑‍🏫" label="Formateurs" value={overview?.totalFormateurs || 0} sub="formateurs actifs" color={AMBER} />
          <KPIBadge icon="🏷️" label="Domaines" value={overview?.totalDomaines || 0} sub="domaines couverts" color={BLUE} />
        </div>

        {/* Row 1: Donut | Completion | Bloom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.7fr', gap: 10, marginBottom: 10 }} className="r2">
          <Card>
            <Title>Formations par domaine</Title>
            <div style={{ fontSize: 9, color: MUTED, marginBottom: 6 }}>Cliquer sur le donut pour agrandir</div>
            <DomaineDonut domains={domaines} />
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Title accent={BLUE}>Participants par structure</Title>
              <button onClick={() => setExpandedWidget('structures')} style={{ background: 'none', border: '1px solid #bfdbfe', borderRadius: 12, padding: '2px 8px', fontSize: 9, color: BLUE, cursor: 'pointer' }}>Agrandir</button>
            </div>
            <div style={{ fontSize: 9, color: MUTED, marginBottom: 4 }}>Survol pour voir le detail</div>
            <DirectionBars directions={directions} />
          </Card>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Title>Total formations</Title>
            <Bloom value={overview?.totalFormations || 0} label="formations" />
            <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: G1 }}>{realizedCount}</div>
                <div style={{ fontSize: 8, color: MUTED }}>Realisees</div>
              </div>
              <div style={{ width: 1, background: '#d1fae5' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: BLUE }}>{plannedCount}</div>
                <div style={{ fontSize: 8, color: MUTED }}>Planifiees</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Row 2: Cost chart | Direction bars | Calendar */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1fr 1fr', gap: 10, marginBottom: 10, alignItems: 'stretch' }} className="r3">
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Title accent={TEAL}>Taux de completion</Title>
              <button onClick={() => setExpandedWidget('completion')} style={{ background: 'none', border: '1px solid #99f6e4', borderRadius: 12, padding: '2px 8px', fontSize: 9, color: TEAL, cursor: 'pointer' }}>Agrandir</button>
            </div>
            <div style={{ fontSize: 9, color: MUTED, marginBottom: 6 }}>Fenetre glissante sur 3 mois: mois precedent, mois courant et mois suivant</div>
            <CompletionBars items={completionItems} />
          </Card>
          <Card style={{ gridColumn: 'span 2', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Title>Planning formations</Title>
              <button onClick={() => setExpandedWidget('calendar')} style={{ background: 'none', border: '1px solid #86efac', borderRadius: 12, padding: '2px 8px', fontSize: 9, color: G1, cursor: 'pointer' }}>Agrandir</button>
            </div>
            <FormationCalendar formations={calendarFormations} />
          </Card>
        </div>

        {/* Row 3: Annual comparison */}
        <Card className="r4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Title>Statistiques des formations sur 5 ans</Title>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={() => setExpandedWidget('line')} style={{ background: 'none', border: '1px solid #86efac', borderRadius: 12, padding: '2px 8px', fontSize: 9, color: G1, cursor: 'pointer' }}>Agrandir</button>
              <div />
            </div>
          </div>
          <FiveYearStatsChart series={monthlySeries} />
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title accent={AMBER}>Cout mensuel des formations</Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: AMBER, background: '#fef3c7', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 999 }}>
                Total annuel: {annualCostTotal.toLocaleString('fr-FR')} Dt
              </div>
              <button onClick={() => setExpandedWidget('cost')} style={{ background: 'none', border: '1px solid #fde68a', borderRadius: 12, padding: '2px 8px', fontSize: 9, color: AMBER, cursor: 'pointer' }}>Agrandir</button>
            </div>
          </div>
          <div style={{ fontSize: 9, color: MUTED, marginBottom: 4 }}>Budget reel ({currentYear}) — survol pour detail (Dt)</div>
          <CostChart monthlyCosts={monthlyCosts} />
        </Card>
      </div>
      {renderExpandedWidget()}
    </div>
  )
}
