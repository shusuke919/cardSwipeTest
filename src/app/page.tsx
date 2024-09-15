"use client";

import { useState } from "react";
import styles from "./page.module.css";
import SwipeCard from "@/components/SwipeCard";

export default function Home() {
  const [cards, setCards] = useState([
    { color: "#ff595e" },
    { color: "#ffca3a" },
    { color: "#8ac926" },
    { color: "#1982c4" },
    { color: "#6a4c93" },
  ]);

  const handleSwipeEnd = () => {
    // カードをスワイプ後、次のカードを削除して新しいカードリストをセット
    setCards((prevCards) => prevCards.slice(1));
  };

  return (
    <div className={styles.page}>
      {cards.length > 0 ? (
        <>
          {cards.slice(1, 3).map((card, index) => (
            <SwipeCard
              key={index}
              color={card.color}
              zIndex={cards.length - index - 1}
              onSwipeEnd={() => {}}
            />
          ))}
          <SwipeCard
            key={cards[0].color}
            color={cards[0].color}
            zIndex={cards.length}
            onSwipeEnd={handleSwipeEnd}
          />
        </>
      ) : (
        <div>もうカードはありません</div>
      )}
      こんばんわ
    </div>
  );
}
