export function Skeleton({ w = '100%', h = 16, r = 8, style }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: r, ...style }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12, border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)' }}>
      <Skeleton h={180} r={12} />
      <Skeleton w="70%" h={14} />
      <Skeleton w="40%" h={12} />
      <Skeleton w="50%" h={16} />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 12, border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)' }}>
      <Skeleton w={72} h={72} r={10} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
        <Skeleton w="60%" h={14} />
        <Skeleton w="35%" h={12} />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
