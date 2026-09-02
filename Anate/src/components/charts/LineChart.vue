<script setup lang="ts">
    import type { NamedPoint } from "@/types/charts/NamedPoint";
    import mapShowsToGaussianScores from "@/types/statistics/DistributionCalculator";
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        type ChartData,
        type Point,
        type TooltipItem
    } from "chart.js";
    import { onMounted } from "vue";
    import { Line } from "vue-chartjs";

    const props = defineProps(["distribution"]);
    // seems overkill but that's the genuine type being passed in. w/e.
    let data: ChartData<"line", (number | Point | null)[], unknown>;
    const options = {
        responsive: true,
        aspectRatio: 3,
        maintainAspectRatio: true,
        scales: {
            x: {
                ticks: {
                    callback: (index: number) => {
                        return index % 2 === 0 ? index : "";
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function (context: TooltipItem<"line">[]) {
                        const point = context[0]!.raw as NamedPoint;
                        return `Name: ${point.name} (Score: ${point.x})`;
                    }
                }
            }
        }
    };

    if (props.distribution) {
        const mappedScores = mapShowsToGaussianScores(props.distribution, {
            minScore: 1,
            maxScore: 100,
            meanPlacement: 0.65,
            spread: 0.25
        });
        data = {
            labels: [...mappedScores.keys()].map((k: number) => k + 1),
            datasets: [
                {
                    label: "Score",
                    backgroundColor: "#f87979",
                    data: mappedScores.map((m, i) => {
                        return {
                            x: i + 1,
                            y: m.score,
                            name: m.title.english
                        } as Point;
                    }),
                    tension: 0.3,
                    pointRadius: 5,
                    pointBorderWidth: 10
                }
            ]
        };
    }

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    onMounted(() => {
        console.log(data);
    });
</script>

<template>
    <!-- @vue-expect-error I am not sifting through the types in that error message to figure out what is going on in there. no. -->
    <Line class="canvas-background" :data="data" :options="options" />
</template>

<style lang="scss">
    .canvas-background {
        border-radius: 1em;
        background-color: #1a1a1a;
    }
</style>
