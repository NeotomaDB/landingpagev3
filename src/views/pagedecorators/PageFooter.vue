<script setup>
import Card from 'primevue/card';
</script>

<template>
  <div role="contentinfo">
    <Card>
      <template #content>
        <div class="footer-grid">
          <div class="footer-section">
            <img src="@/assets/nsf.png" width="100" height="100" alt="National Science Foundation logo"
              class="footer-logo">
            <div class="footer-text">
              <br><a href=https://www.nsf.gov>National Science Foundation</a>
              <br>Directorate for Geosciences
              <br>Division of Earth Sciences
            </div>
          </div>
          <div class="footer-section footer-section-right">
            <div class="footer-text text-right">
              <a href=https://earthcube.org>EarthCube</a>
              <br>Integrative Activities
              <br>National Science Foundation
            </div>
            <img src="@/assets/logo_earthcube_cube-only_SMALL.png" style="margin-top:10px" width=100 height=100
              alt="EarthCube logo." class="footer-logo">
          </div>
        </div>
        <div class="collaboration-notice">
          <a href="https://localcontexts.org/notice/open-to-collaborate/"
            aria-label="Open to Collaborate label information.">
            <img src="../../assets/Open_To_Collaborate.svg" width=50 alt="Open to Collaborate logo from LocalContext.">
          </a>
          <div class="collaboration-text">
            <strong>Our institution is committed to the development of new modes of collaboration, engagement, and
              partnership with Indigenous peoples for the care and stewardship of past and future heritage
              collections.</strong>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>


<style scoped>
.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.footer-section {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 1rem;
}

.footer-section-right {
  justify-content: flex-end;
}

.footer-logo {
  flex-shrink: 0;
}

.footer-text {
  text-align: left;
}

.text-right {
  text-align: right;
}

.collaboration-notice {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.collaboration-icon {
  display: flex;
  align-items: center;
}

.collaboration-text {
  line-height: 1.5;
}
</style>