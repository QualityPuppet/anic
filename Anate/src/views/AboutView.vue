<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEarthAsia, faEarthEurope } from '@fortawesome/free-solid-svg-icons'


const quotes = [
  "悪いスライムじゃないよ",
  "Everyone returns to dust. That's true for nobles, farmers. No matter the status one is born into, we are all equals in the end.",
  "To eat is the privilege of the living.",
  "お、神よ。。。貴様を切り刻んで、豚の餌にしてやる",
  "天上天下唯我独尊",
  "Nah, I'd win",
  "WE'RE HAVING A MOMENT HERE!",
  "A wise man once said, any anime where they jump in the OP is a god-tier anime. (A/N... D/N? - Ryo has questionable taste)",
  "アウラ、自歳しろう"
]

const currentQuote = ref("");
const quote = computed(() => currentQuote)

const japanese = ref(false);

onMounted(() => {
  getQuote();
})

function getQuote() {
  currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)]!;
}

</script>

<template>
  <div class="about" style="height:100%">
    <el-row justify="center" align="middle" style="width: 100%">
      <el-col :span="4">
        <img class="avatar" src="https://avatars.githubusercontent.com/u/19232517">
      </el-col>
      <el-col :span="12">
        <el-row>
          <h1 v-if="!japanese">
            <FontAwesomeIcon @click="japanese = !japanese" style="height: 1em; cursor:pointer" :icon="faEarthAsia" />
            Hi! I'm <a href="https://www.github.com/QualityPuppet">Eve!</a>
          </h1>
          <h1 v-if="japanese">
            <FontAwesomeIcon @click="japanese = !japanese" style="height: 1em; cursor:pointer" :icon="faEarthEurope" />
            おはよう! 私は<a href="https://www.github.com/QualityPuppet">エビだよ!</a>
          </h1>
        </el-row>
        <el-row :span="12">
          <el-text size="large">
            I enjoy watching anime and statistics, so I wanted to leverage <a href="https://malsync.moe/">MAL-Sync</a>
            (and the coding knowledge I reportedly have) to make a programmatic way of sorting and
            then statistically ranking the anime I've watched. <br />
            As of August, this is the 1.0 version of the website, with the base skeleton and an binary sort algorithm
            implemented, in the future ideally I'd like to implement a bell curve algorithm with parameters that can be
            user-tweaked,
            and visualised with charting.
          </el-text>
        </el-row>
        <!-- TODO: There's gotta be a better way to do this. -->
        <br />
        <el-row :span="12" align="middle">
          <!-- TODO: make this a class? -->
          <RefreshRight @click="getQuote" style="cursor: pointer; height:1em; margin-right:0.5rem" />
          {{ quote }}
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    /* min-height: 100vh; */
    display: flex;
    align-items: center;
  }
}

.avatar {
  border-radius: 50% !important;
  height: 10em;
}
</style>
