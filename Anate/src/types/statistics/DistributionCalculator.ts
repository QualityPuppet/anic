import type { Media } from "../anilist/MediaListCollections";

interface DistributionParameters {
    minScore: number,
    maxScore: number,
    meanPlacement: number,
    spread: number
}

// A/N - I frankly have no clue how this works, this is taken from the internet.

/**
 * Maps a sorted list of items to scores using a Gaussian (Normal) curve.
 * @param {Array} list - Your sorted array of shows (from best to worst).
 * @param {Object} options - Configuration variables.
 * @param {number} options.minScore - The lowest score you want to assign (e.g., 1 or 10).
 * @param {number} options.maxScore - The highest score you want to assign (e.g., 10 or 100).
 * @param {number} options.meanPlacement - Controls where the "bunching" happens. 
 *                                         0.5 = dead center, 0.7 = bunched near the top, 0.3 = bunched near the bottom.
 * @param {number} options.spread - Controls flattening vs. steepness. 
 *                                  Lower values (0.1 - 0.2) steepen the curve (bunching data tightly). 
 *                                  Higher values (0.4 - 0.6) flatten it out into a linear line.
 * @returns {Array} An array of objects containing the original show and its calculated score.
 */
export default function mapShowsToGaussianScores(
    list: Media[], 
    { 
        minScore = 1, 
        maxScore = 100, 
        meanPlacement = 0.5, 
        spread = 0.25 
    }: DistributionParameters): Media[] {
    const N = list.length;
    if (N === 0) return [];
    if (N === 1) return list;;

    // Gaussian Cumulative Distribution Function
    function gaussianCDF(x: number, mean: number, sigma: number) {
        return 0.5 * (1 + errorFunction((x - mean) / (sigma * Math.sqrt(2))));
    }

    // Step 1: Pre-calculate the theoretical min/max CDF values to handle edge-case clipping
    // This ensures our scores scale perfectly from exactly minScore to maxScore
    const cdfMin = gaussianCDF(0, meanPlacement, spread);
    const cdfMax = gaussianCDF(1, meanPlacement, spread);
    const cdfRange = cdfMax - cdfMin;

    return list.map((show: Media, index: number) => {
        // Normalize the rank position between 0 (best/top) and 1 (worst/bottom)
        // Reversed so index 0 gets the highest percentile
        const percentile = 1 - (index / (N - 1));

        // Step 2: Calculate the raw Gaussian CDF value for this percentile
        const rawCDF = gaussianCDF(percentile, meanPlacement, spread);

        // Step 3: Rescale the CDF value smoothly into the target min/max score range
        const normalizedCDF = (rawCDF - cdfMin) / cdfRange;
        const score = minScore + normalizedCDF * (maxScore - minScore);

        
        show.score = Math.round(score * 10) / 10
        return show
    });
}

// A/N: these are apparently magic numbers that weight almost perfectly onto a gaussian function.
// silly silly silly. not sure how I was ever supposed to figure that one out without copy pasting.
// Standard Error Function (ERF) approximation to calculate the Gaussian CDF
function errorFunction(x: number) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);

    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

    return sign * y;
}