// Script d'optimisation - Remplacer les 3 appels API par 1 seul avec caching
// Ajouter ce code en haut du fichier formations-dashboard.tsx:

import { useDashboardData } from '@/hooks/useDashboardData';

// Skeleton Loader Component
function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Top KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// Remplacer l'ancien useEffect par:
export default function FormationsDashboard() {
  const yr = new Date().getFullYear();
  
  // ✨ Utiliser le hook optimisé
  const { data: dashboardData, loading, error, refresh } = useDashboardData();

  // Déstructurer les données
  const overview = dashboardData?.overview;
  const domaines = dashboardData?.formationsParDomaine?.map((d: any) => ({
    name: d.label,
    pct: 0 // À calculer si besoin
  })) || [];
  const directions = dashboardData?.participantsParStructure?.map((d: any) => ({
    name: d.label,
    participants: d.value || 0
  })) || [];

  // État de chargement
  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <DashboardSkeleton />
      </div>
    );
  }

  // Gestion erreurs
  if (error) {
    return (
      <div style={{
        background: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#991b1b',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ Erreur de chargement</div>
        <div style={{ fontSize: '14px', marginBottom: '12px' }}>{error}</div>
        <button
          onClick={refresh}
          style={{
            background: '#991b1b',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🔄 Réessayer
        </button>
      </div>
    );
  }

  // Si pas de données
  if (!overview) {
    return <div>Aucune donnée disponible</div>;
  }

  // Le reste du composant reste identique...
  return (
    <div style={{ padding: '20px', background: BACKGROUND }}>
      {/* Bouton refresh optionnel */}
      <button
        onClick={refresh}
        style={{
          marginBottom: '16px',
          padding: '8px 16px',
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        🔄 Rafraîchir
      </button>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPIBadge icon="📚" label="Formations" value={overview.totalFormations} color={BLUE} />
        <KPIBadge icon="👥" label="Participants" value={overview.totalParticipants} color={G1} />
        <KPIBadge icon="🎓" label="Formateurs" value={overview.totalFormateurs} color={PURPLE} />
        <KPIBadge icon="🏷️" label="Domaines" value={overview.totalDomaines} color={ORANGE} />
      </div>

      {/* 2x2 Grid for main charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <Card title="Formations par Domaine" chart={<DomaineDonut domaines={domaines} />} />
        <Card title="Participants par Direction" chart={<DirectionBars directions={directions} />} />
        <Card title="Budget Mensuel" chart={<CostChart />} />
        <Card title="Calendrier Formations" chart={<FormationCalendar />} />
      </div>

      {/* Bottom charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <Card title="Formations: Année Actuelle vs Passée" chart={<FormationsLineChart />} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// IMPORTANT: Garder tous les autres composants:
// - KPIBadge()
// - DomaineDonut()
// - DirectionBars()
// - CostChart()
// - FormationCalendar()
// - FormationsLineChart()
// - Card()
// - Bloom()
// - Particles()
// - Tooltip()
// ─────────────────────────────────────────────────────────────────
