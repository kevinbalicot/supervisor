<template>
    <TopNavbar>
        <SearchBar :options="searchOptions" @refresh="onSearchBarRefreshed"></SearchBar>
    </TopNavbar>

    <main class="container-fluid">
        <h2 class="mb-4">{{ $t('hello_world') }} <Emoji code="waving"></Emoji></h2>

        <div class="row">
            <div v-for="instance in instances" class="col-xxl-4 col-md-6">
                <div class="card shadow-sm mb-4">
                    <header class="card-header d-flex bg-white align-items-center justify-content-between p-lg-4 p-md-3">
                        <span><Icon :icon="instance.icon"/> {{ instance.name }}</span>
                        <Status :instance="instance"/>
                    </header>

                    <div>
                        <Stats :instance="instance"/>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import TopNavbar from "../modules/app/components/Default/TopNavBar.vue";
import Emoji from "../modules/ui/components/elements/Emoji.vue";
import Icon from "../modules/ui/components/elements/Icon.vue";
import Stats from "../modules/app/components/Instance/Stats.vue";
import Status from "../modules/app/components/Instance/Status.vue";
import SearchBar from "../modules/ui/components/search/SearchBar.vue";

import InstanceFactory from "../../src/Factory/Instance";

import { findUrl } from "../modules/app/components/Instance/parameters";
import { inject, ref, onMounted, reactive } from "vue";

const instances = ref([]);
const repository = inject('repository');
const searchOptions = reactive({ tokens: [] });

onMounted(() => fetch());

const fetch = (params = {}) => {
    repository.get(findUrl(), params)
        .then(data => data.map(InstanceFactory.createFromData))
        .then(values => instances.value = values);
};

const onSearchBarRefreshed = ({ search, tokens }) => {
    const params = tokens.reduce((params, token) => {
        params[token.key] = token.value.key || token.value;

        return params;
    }, search ? { search, searchTarget: 'name' } : {});

    fetch(params);
};
</script>
