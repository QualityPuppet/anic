<script setup lang="ts">
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

const props = defineProps(['distribution'])

const data = {
    labels: props.distribution.map(d => d[0]),
    datasets: [
        {
            label: 'show data',
            backgroundColor: '#f87979',
            data: props.distribution.map(d => d[1])
        }
    ]
}
console.log(props.distribution)
console.log(data)
const data2 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 39, 10, 40, 39, 80, 40]
        }
    ]
}

const options = {
    responsive: true,
    maintainAspectRatio: true
}


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

</script>

<template>
    <Line :data="data" :options="options" />
</template>