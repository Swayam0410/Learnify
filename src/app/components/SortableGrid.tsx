// components/SortableGrid.tsx
"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Item {
  id: string;
  title: string;
  url: string;
  subreddit: string;
  thumbnail?: string;
}

interface SortableGridProps {
  items: Item[];
}

const SortableItem = ({ item }: { item: Item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border shadow p-4 rounded-lg"
    >
      {item.thumbnail && item.thumbnail.startsWith("http") && (
        <img
          src={item.thumbnail}
          alt=""
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 hover:underline"
      >
        {item.title}
      </a>
      <p className="text-sm text-gray-500">r/{item.subreddit}</p>
    </div>
  );
};

const SortableGrid: React.FC<SortableGridProps> = ({ items }) => {
  const [cards, setCards] = useState<Item[]>(items);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = cards.findIndex((item) => item.id === active.id);
      const newIndex = cards.findIndex((item) => item.id === over.id);
      setCards(arrayMove(cards, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={cards} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableGrid;
