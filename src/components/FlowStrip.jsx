import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableChip({ item, index, total, onRemove, onMove }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative',
        flexShrink: 0,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {/* position number */}
            <span style={{
                position: 'absolute', top: -6, left: -6, zIndex: 1,
                background: '#534AB7', color: '#fff',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: 10, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {index + 1}
            </span>

            {/* remove button */}
            <button
                onClick={() => onRemove(item.id)}
                style={{
                    position: 'absolute', top: -6, right: -6, zIndex: 1,
                    width: 18, height: 18, borderRadius: '50%',
                    border: '0.5px solid #dee2e6', background: 'white',
                    color: '#6c757d', fontSize: 11, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, lineHeight: 1
                }}
            >
                ×
            </button>

            {/* drag handle + image + name */}
            <div
                style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 4, padding: '8px 10px', width: 80, height: 90,
                    background: 'white', border: '0.5px solid #dee2e6',
                    borderRadius: 10, cursor: 'grab'
                }}
                {...attributes} {...listeners}
            >
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, pointerEvents: 'none' }}
                />
                <span style={{ fontSize: 10, textAlign: 'center', color: '#6c757d', lineHeight: 1.3,
                    width: '100%', overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                 }}>
                    {item.name}
                </span>
            </div>

            {/* arrow buttons */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: 4, gap: 2
            }}>
                <button
                    onClick={() => onMove(index, index - 1)}
                    disabled={index === 0}
                    title="Move left"
                    style={{
                        flex: 1, padding: '2px 0', fontSize: 11,
                        border: '0.5px solid #dee2e6', borderRadius: 4,
                        background: 'white', cursor: index === 0 ? 'not-allowed' : 'pointer',
                        color: index === 0 ? '#dee2e6' : '#6c757d',
                        lineHeight: 1
                    }}
                >
                    ‹
                </button>
                <button
                    onClick={() => onMove(index, index + 1)}
                    disabled={index === total - 1}
                    title="Move right"
                    style={{
                        flex: 1, padding: '2px 0', fontSize: 11,
                        border: '0.5px solid #dee2e6', borderRadius: 4,
                        background: 'white', cursor: index === total - 1 ? 'not-allowed' : 'pointer',
                        color: index === total - 1 ? '#dee2e6' : '#6c757d',
                        lineHeight: 1
                    }}
                >
                    ›
                </button>
            </div>
        </div>
    );
}

export default function FlowStrip({ flow, onReorder, onRemove }) {
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = flow.findIndex(p => p.id === active.id);
            const newIndex = flow.findIndex(p => p.id === over.id);
            onReorder(arrayMove(flow, oldIndex, newIndex));
        }
    };

    const handleMove = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= flow.length) return;
        onReorder(arrayMove(flow, fromIndex, toIndex));
    };

    if (flow.length === 0) {
        return (
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                No poses added yet — click "+ Add to flow" on any pose below to begin.
            </p>
        );
    }

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={flow.map(p => p.id)} strategy={horizontalListSortingStrategy}>
                <div className="d-flex gap-3 overflow-auto pb-2" style={{ paddingTop: 8 }}>
                    {flow.map((item, index) => (
                        <SortableChip
                            key={item.id}
                            item={item}
                            index={index}
                            total={flow.length}
                            onRemove={onRemove}
                            onMove={handleMove}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}