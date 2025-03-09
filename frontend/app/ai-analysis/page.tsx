"use client";

import { useState } from "react";
import styles from "./ai-analysis.module.css";

export default function AIAnalysisPage() {
  // future api integration
  const [analysisData, setAnalysisData] = useState({
    age: 25,
    weight: "68 kg",
    healthStatus: "Good",
    sleepingHours: [
      { date: "2025-03-01", hours: 7 },
      { date: "2025-03-02", hours: 6.5 },
      { date: "2025-03-03", hours: 8 },
      { date: "2025-03-04", hours: 7.2 },
      { date: "2025-03-05", hours: 6 },
      { date: "2025-03-06", hours: 7.5 },
      { date: "2025-03-07", hours: 7 },
    ],
    aiAdvice: "Maintaining a consistent sleep schedule will improve your overall health. Consider reducing screen time before bed.",
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI Analysis</h1>

      {/* small blocks - age、weight、Health Status */}
      <div className={styles.smallBlocks}>
        <div className={styles.block}>
          <span className={styles.label}>Age</span>
          <span className={styles.value}>{analysisData.age} years</span>
        </div>
        <div className={styles.block}>
          <span className={styles.label}>Weight</span>
          <span className={styles.value}>{analysisData.weight}</span>
        </div>
        <div className={styles.block}>
          <span className={styles.label}>Health Status</span>
          <span className={styles.value}>{analysisData.healthStatus}</span>
        </div>
      </div>

      {/* big blocks - Sleeping Hours */}
      <div className={styles.largeBlock}>
        <span className={styles.label}>Sleeping Hours (Last 7 Days)</span>
        <div className={styles.sleepingHours}>
          {analysisData.sleepingHours.map((entry, index) => (
            <div key={index} className={styles.sleepEntry}>
              <span>{entry.date}</span>
              <span>{entry.hours} hrs</span>
            </div>
          ))}
        </div>
      </div>

      {/* big blocks -  AI reccommendation */}
      <div className={styles.largeBlock}>
        <span className={styles.label}>AI Advice</span>
        <p className={styles.adviceText}>{analysisData.aiAdvice}</p>
      </div>
    </div>
  );
}
