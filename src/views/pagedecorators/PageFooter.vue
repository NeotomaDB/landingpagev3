<script setup>
import Card from 'primevue/card';
</script>
<template>
  <Card>
    <template #content>
      <div class="grid" style="justify-content:space-between;">
        <div class="col-5 flex" style="justify-content:space-evenly;">
          <div style="text-align:left;">
            <img src="@/assets/nsf.png" width="100" height="100" alt="National Science Foundation logo">
          </div>
          <div>
            <!--  <Card class="align-middle" style="text-align:left;padding: left 5px;"> 
            <template #content> 
              <Avatar image="../nsf.png" /> -->
            <br><a href=https://www.nsf.gov />National Science Foundation</a>
            <br>Directorate for Geosciences
            <br>Division of Earth Sciences
            <!--    </template>
</Card> -->
          </div>
        </div>
        <div class="col-5 flex" style="justify-content:space-evenly;align-items:center;">
          <div style="text-align:right;">
            <a href=https://earthcube.org>EarthCube</a><br>Integrative Activities<br>National Science Foundation
          </div>
          <div style="text-align:left;">
            <img src="@/assets/logo_earthcube_cube-only_SMALL.png" style="margin-top:10px" width=100 height=100
              alt="EarthCube logo.">
          </div>
        </div>
      </div>
      <Card>
        <template #content>
          <div class="grid" style="justify-content:space-between;">
            <div class="col-1">
              <a href="https://localcontexts.org/notice/open-to-collaborate/"
                aria-label="Open to Collaborate label information."><img src="../../assets/Open_To_Collaborate.svg"
                  width=50 alt="Open to Collaborate logo from LocalContext."></a>
            </div>
            <div class="col-11">
              <strong>Our institution is committed to the development of new modes of collaboration, engagement, and
                partnership with Indigenous peoples for the care and stewardship of past and future heritage
                collections.</strong>
            </div>
          </div>
        </template>
      </Card>
    </template>
  </Card>
</template>

<script>
export default {
  name: 'LandingPageFooter',
  data() {
    return {
      msg: 'Exporting the webpage footer.'
    }
  }
}
</script>
