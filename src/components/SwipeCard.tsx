import { useRef, useState } from "react";
import styles from "../app/page.module.css";

// カスタムプロパティを持つ要素の型を定義
interface CardElement extends HTMLDivElement {
  startX: number;
  startY: number;
}

interface SwipeCardProps {
  color: string;
  onSwipeEnd: () => void;
  zIndex: number;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ color, onSwipeEnd, zIndex }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const cardRef = useRef<CardElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!cardRef.current) return;
    setIsSwiping(true);
    const startX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const startY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    cardRef.current.startX = startX;
    cardRef.current.startY = startY;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSwiping || !cardRef.current) return;
    const moveX = 'touches' in e
      ? e.touches[0].clientX - cardRef.current.startX
      : (e as React.MouseEvent).clientX - cardRef.current.startX;
    const moveY = 'touches' in e
      ? e.touches[0].clientY - cardRef.current.startY
      : (e as React.MouseEvent).clientY - cardRef.current.startY;

    // 横の移動に基づいて透明度を変更
    const moveOpacity = 1 - Math.abs(moveX) / window.innerWidth;
    setOpacity(moveOpacity);

    setPosition({ x: moveX, y: moveY });
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    // カードをスワイプした距離が一定以上の場合に、画面外にスワイプ
    if (Math.abs(position.x) > 150) {
      const direction = position.x > 0 ? 1 : -1;
      setPosition({ x: direction * window.innerWidth, y: position.y });
      setOpacity(0);
      onSwipeEnd();
    } else {
      setPosition({ x: 0, y: 0 });
      setOpacity(1);
    }
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      style={{
        backgroundColor: color,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${
          position.x / 20
        }deg)`,
        opacity: opacity,
        // カードの重なり順を制御
        zIndex: zIndex,
        transition: !isSwiping ? "transform 0.5s, opacity 0.5s" : "none",
      }}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};
export default SwipeCard;
