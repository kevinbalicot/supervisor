<template>
    <Modal :id="modalId('show')" :title="$t('show_resource')">
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
                        <td>{{ $t('instance') }}</td>
                        <td v-if="item.instance">{{ item.instance.name }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('domain') }}</td>
                        <td><a :href="'//' + item.domain" target="_blank">{{ item.domain }}</a></td>
                    </tr>
                    <tr>
                        <td>{{ $t('created_at') }}</td>
                        <td><Date :date="item.createdAt"/></td>
                    </tr>
                    <tr>
                        <td>{{ $t('edited_at') }}</td>
                        <td><Date :date="item.updatedAt"/></td>
                    </tr>
                </tbody>
            </table>
        </template>

        <template #footer="{ close }">
            <Button level="secondary" @click="close()">{{ $t('close') }}</Button>
            <Button level="warning" @click="generateCertificate()" icon="file-certificate" :loading="loading">
                {{ $t('generate_certificate') }}
            </Button>
        </template>
    </Modal>
</template>

<script setup>
import Modal from "../../../ui/components/elements/Modal.vue";
import Button from "../../../ui/components/elements/Button.vue";
import Icon from "../../../ui/components/elements/Icon.vue";
import Date from "../../../ui/components/elements/Date.vue";

import { eventName, modalId, generateCertificateUrl } from './parameters';
import { inject, ref, onMounted } from "vue";

const repository = inject('repository');
const emitter = inject('emitter');

const item = ref({});
const error = ref();
const loading = ref(false);

onMounted(() => {
    emitter.on(eventName('show'), resource => item.value = resource);
});

const generateCertificate = () => {
    error.value = null;
    loading.value = true;
    repository.put(generateCertificateUrl(item.value._id))
        .then(() => loading.value = false)
        .catch(({ code, message }) => {
            error.value = `[${code}] ${message}`;
            loading.value = false;
        });
};

</script>
