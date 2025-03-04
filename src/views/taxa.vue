<script setup>
import TaxaMap from '@/views/resources/taxaelements/taxamap.vue'
</script>

<template>
    <h1>Taxon Landing Page for {{ taxoninfo.taxonname }}</h1>
    Total number of sites: {{ sitecount }}
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