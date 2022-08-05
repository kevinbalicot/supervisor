<template>
    <span class="d-inline-flex align-items-center" v-if="status">
        <Icon :class="{'text-success': status.Running, 'text-warning': status.Paused, 'text-danger': !status.Running}" icon="circle"/>
        <span class="ms-1">{{ status.Status }}</span>
    </span>
</template>

<script setup>
import Icon from "../../../ui/components/elements/Icon.vue";

import { inject, onMounted, ref } from "vue";
import { statusUrl } from "./parameters";

const { instance } = defineProps({
    instance: Object,
});

const status = ref();
const repository = inject('repository');

onMounted(() => {
    repository.get(statusUrl(instance._id)).then(value => status.value = value);
});
</script>
