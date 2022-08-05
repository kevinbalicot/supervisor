<template>
    <div class="row p-2">
        <div class="col-lg-6 col">
            <canvas ref="memoryc"></canvas>
        </div>

        <div class="col-lg-6 col">
            <canvas ref="cpuc"></canvas>
        </div>
    </div>

    <div class="row p-2">
        <span>Net : {{ netIO }}</span>
        <span>Block : {{ blockIO }}</span>
    </div>
</template>

<script setup>
import { Chart, ArcElement, DoughnutController, Legend, Title, Tooltip } from "chart.js";

import { statsUrl } from './parameters';
import { inject, ref, computed, onMounted } from "vue";

Chart.register(DoughnutController, ArcElement, Legend, Title, Tooltip);

const { instance } = defineProps({
    instance: Object,
});

const state = ref();
const memoryc = ref();
const cpuc = ref();
const repository = inject('repository');

const netIO = computed(() => state.value ? state.value.net : null);
const blockIO = computed(() => state.value ? state.value.block : null);

onMounted(() => {
    repository.get(statsUrl(instance._id)).then(value => {
        state.value = value;

        const { memory, cpu } = value;
        const memoryUsage = parseFloat(memory.percent.replace('%', ''));
        const cpuUsage = parseFloat(cpu.replace('%', ''));

        new Chart(memoryc.value, {
            type: 'doughnut',
            data: {
                labels: ['Memory', 'Free'],
                datasets: [
                    {
                        label: 'Dataset 1',
                        data: [memoryUsage, 100 - memoryUsage],
                        backgroundColor: ['#48c1c1', '#e5e5e5'],
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Memory usage ${memory.raw} - ${memory.percent}`,
                    }
                }
            }
        });

        new Chart(cpuc.value, {
            type: 'doughnut',
            data: {
                labels: ['CPU', 'Free'],
                datasets: [
                    {
                        label: 'Dataset 1',
                        data: [cpuUsage, 100 - cpuUsage],
                        backgroundColor: ['#ff6384', '#e5e5e5'],
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `CPU Usage ${cpu}`,
                    }
                }
            }
        });
    });
});
</script>
