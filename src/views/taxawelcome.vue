<script setup>
import TaxaSearch from '@/views/resources/taxaelements/taxasearch.vue';
import Panel from 'primevue/panel';

</script>

<template>
    <Panel>
        <template #header>
    <h1>Taxon Landing Pages</h1>
        </template>
    <p>Welcome to the Neotoma Taxon Landing Pages! On this page you can search for taxa of interest and navigate to individual pages about them where you can learn more.</p>
    </Panel>
    <Panel>
    <template #header>
        <h2>Taxon Search</h2>
    </template>
 <TaxaSearch />
</Panel>
</template>