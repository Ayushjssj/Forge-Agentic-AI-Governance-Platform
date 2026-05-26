from scipy.stats import norm
import math

def sigma_from_defect_rate(defects: int, total: int) -> float:
    """Convert defect count to Six Sigma score."""
    if total == 0:
        return 0.0
    if defects == 0:
        return 6.0  # perfect

    dpmo = (defects / total) * 1_000_000
    yield_rate = 1 - (dpmo / 1_000_000)

    # Clamp to avoid norm.ppf blowing up at 0 or 1
    yield_rate = max(0.0001, min(0.9999, yield_rate))

    # Short-term sigma with 1.5 shift (industry standard)
    sigma = float(norm.ppf(yield_rate) + 1.5)
    return round(sigma, 2)