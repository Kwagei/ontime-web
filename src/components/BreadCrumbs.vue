<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb m-0">
        <li
          class="breadcrumb-item"
          v-for="(breadcrumb, index) in activeBreadCrumbs"
          :key="breadcrumb"
          style="font-weight: 600"
        >
          <template v-if="breadCrumbs[index + 1]">
            <router-link :to="`/${breadcrumb.link}`">
              <span>{{ breadcrumb.name }}</span>
            </router-link>
          </template>
          <span v-else>{{ breadcrumb.name }}</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const breadCrumbs = defineModel("breadCrumbs");
const activeBreadCrumbs = ref("");

activeBreadCrumbs.value = breadCrumbs.value.map((crumb, index) => {
  let c = [];
  for (let i = 0; i <= index; i++) {
    c.push(breadCrumbs.value[i]);
  }

  return { name: crumb, link: c.join("/") };
});
</script>

<style scoped>
.breadcrumb-item span {
  text-transform: capitalize;
}
</style>
