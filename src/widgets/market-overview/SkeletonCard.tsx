import { styles } from "./styles";

export const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonHeader}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.skeletonTextStack}>
        <div className={styles.skeletonName} />
        <div className={styles.skeletonTicker} />
      </div>
    </div>
    <div className={styles.skeletonPrice} />
    <div className={styles.skeletonChange} />
  </div>
);
