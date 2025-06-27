import { motion } from "motion/react";
import { useEffect, useState } from "react";

// 打字机效果组件
const TypeWriterEffect = ({
  text,
  speed = 100,
  delay = 0,
  className = "",
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (delay > 0) {
      timeoutId = setTimeout(() => {
        startTyping();
      }, delay);
    } else {
      startTyping();
    }

    function startTyping() {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
          // 打字完成后，让光标闪烁一会儿然后消失
          setTimeout(() => {
            setShowCursor(false);
          }, 1000);
        }
      }, speed);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, speed, delay]);

  // 光标闪烁效果
  useEffect(() => {
    if (!showCursor) return;

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, [showCursor]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <motion.span
          className="ml-1 inline-block h-[1em] w-0.5 bg-current"
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </span>
  );
};
export default TypeWriterEffect;
