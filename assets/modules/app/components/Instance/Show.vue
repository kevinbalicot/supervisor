<template>
    <Modal id="show-instance" :title="$t('show_resource')">
        <template v-if="item" #body="{ success }">
            <p v-if="error" class="alert alert-danger">{{ error }}</p>

            <header class="text-center">
                <Icon :icon="item.icon"/>
            </header>

            <table class="table table-hover mt-4">
                <tbody>
                    <tr>
                        <td>{{ $t('name') }}</td>
                        <td>{{ item.name }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('repository') }}</td>
                        <td>{{ item.repository }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('branch') }}</td>
                        <td>{{ item.branch }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('server') }}</td>
                        <td v-if="item.server">
                            <BadgeServer :instance="item"/>
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t('dockerfile') }}</td>
                        <td>{{ item.dockerfile }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('port') }}</td>
                        <td>{{ item.port }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('created_at') }}</td>
                        <td><Date :date="item.createdAt"/></td>
                    </tr>
                    <tr>
                        <td>{{ $t('edited_at') }}</td>
                        <td><Date :date="item.updatedAt"/></td>
                    </tr>
                    <tr v-if="state">
                        <td>{{ $t('status') }}</td>
                        <td>{{ state.Status }}</td>
                    </tr>
                    <tr v-if="state">
                        <td>{{ $t('started_at') }}</td>
                        <td><Date :date="state.StartedAt"/></td>
                    </tr>
                </tbody>
            </table>

            <div v-if="item.env" class="alert alert-info">
                <table class="table">
                    <tbody>
                        <tr v-for="(value, key) in item.env">
                            <td>{{ key }}</td>
                            <td>{{ value }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template #footer="{ close }">
            <Button level="secondary" @click="close()">{{ $t('close') }}</Button>
            <Button level="warning" @click="deploy()" icon="rocket-launch" :loading="loading">
                {{ $t('deploy') }}
            </Button>

            <Button v-if="isExited" level="success" @click="start()" icon="play" :loading="loading">
                {{ $t('start') }}
            </Button>

            <Button v-if="isRunning" level="primary" @click="restart()" icon="sync" :loading="loading">
                {{ $t('restart') }}
            </Button>

            <Button v-if="isRunning" level="danger" @click="stop()" icon="stop" :loading="loading">
                {{ $t('stop') }}
            </Button>
        </template>
    </Modal>
</template>

<script setup>
import Modal from "../../../ui/components/elements/Modal.vue";
import Button from "../../../ui/components/elements/Button.vue";
import Icon from "../../../ui/components/elements/Icon.vue";
import Date from "../../../ui/components/elements/Date.vue";
import BadgeServer from "../Server/Badge.vue";

import { eventName, statusUrl, deployUrl, startUrl, restartUrl, stopUrl } from "./parameters";
import { inject, ref, computed, onMounted } from "vue";

const item = ref({});
const error = ref();
const loading = ref(false);
const state = ref();

const repository = inject('repository');
const emitter = inject('emitter');

onMounted(() => {
    emitter.on(eventName('show'), resource => {
        item.value = resource;
        getStatus();
    });
});

const isRunning = computed(() => state.value && state.value.Status === 'running');
const isExited = computed(() => state.value && state.value.Status === 'exited');

const getStatus = () => {
    repository.get(statusUrl(item.value._id))
        .then(data => state.value = data);
}

const deploy = () => {
    error.value = null;
    loading.value = true;
    repository.put(deployUrl(item.value._id))
        .then(() => {
            loading.value = false;
            getStatus();
        })
        .catch(({ code, message }) => {
            error.value = `[${code}] ${message}`;
            loading.value = false;
        });
};

const start = () => {
    error.value = null;
    loading.value = true;
    repository.put(startUrl(item.value._id))
        .then(() => {
            loading.value = false;
            getStatus();
        })
        .catch(({ code, message }) => {
            error.value = `[${code}] ${message}`;
            loading.value = false;
        });
};

const restart = () => {
    error.value = null;
    loading.value = true;
    repository.put(restartUrl(item.value._id))
        .then(() => {
            loading.value = false;
            getStatus();
        })
        .catch(({ code, message }) => {
            error.value = `[${code}] ${message}`;
            loading.value = false;
        });
};

const stop = () => {
    error.value = null;
    loading.value = true;
    repository.put(stopUrl(item.value._id))
        .then(() => {
            loading.value = false;
            getStatus();
        })
        .catch(({ code, message }) => {
            error.value = `[${code}] ${message}`;
            loading.value = false;
        });
};
</script>
