<script setup>
import TaxaMap from '@/views/resources/taxaelements/TaxaMap.vue';
import AboutTaxa from '@/views/resources/taxaelements/AboutTaxa.vue';
import TaxaTree from '@/views/resources/taxaelements/TaxaTree.vue';
import {useRoute} from 'vue-router';
const route = useRoute();
</script>

<template>
    <AboutTaxa />
    <TaxaTree />
    <TaxaMap/>
    {{taxondata}}
    {{sitenum}}

</template>

<script>
export default {
  data() {
    return {
      taxoninfo: "",
      sitecount: null,
    };
  },
  computed: {
    taxondata() {
      fetch("https://api.neotomadb.org/v2.0/data/taxa/" + this.$route.params.taxonid, { method: "GET",
             headers: {}})
        .then((response) => {
            response.json().then((data) => {
            this.taxoninfo = data.data[0];
          })
          .catch(err =>
            console.log(err)
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
    sitenum() {
      fetch("https://api.neotomadb.org/v2.0/data/sites?limit=999999&taxonid=" + this.$route.params.taxonid, { method: "GET",
             headers: {}})
        .then((response) => {
            response.json().then((data) => {
            this.sitecount = data.data.length;
          })
          .catch(err =>
            console.log(err)
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
}
</script>