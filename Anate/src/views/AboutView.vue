<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEarthAsia, faEarthEurope } from '@fortawesome/free-solid-svg-icons'
import getVersion from '@/types/versioning';

// these are all getting commented because my brain is a sieve, I'll forget where the quotes are from.
const quotes = [
  // warui suraimu janai yo!
  "悪いスライムじゃないよ",
  // 猫猫
  "恋が女を美しくするのであれば",
  // dunmesh, sorta
  "To eat is the privilege of the living.",
  // oh kami 
  "お、神よ。。。貴様を切り刻んで、豚の餌にしてやる",
  // Above Heaven and Earth, I alone am the Honored One.
  "天上天下唯我独尊",
  // A/N: He did not
  "Nah, I'd win",
  // splat
  "WE'RE HAVING A MOMENT HERE!",
  // DONK DONK DONK
  "絶対気分いいだろうなああああああ。。。ドンドンドン",
  // Aura, kill yourself
  "アウラ、自歳しろう",
  // you know, it really is fascinating how well yet how poorly this translates, -te form is neat
  // the lack of a proper future tense is painful though.
  "花になって",
  // it doesn't matter
  "どうでもいいだろう",
  // https://www.youtube.com/watch?v=F9H5gxH0QAs
  "What if everyone around // Decided to go skipping all across the town?",
  // HOUSHI MONO
  "なんもねえ、なんもねえ、なんもねえよ俺ら。終わてる、終わてる、笑たら、殺すぞ",
  // hot take (maybe lukewarm take idk) - solo levelling season 1 was peak, and it fell off a cliff in season 2
  "交換",
  // A/N: keikaku means plan
  "All according to 計画",
  "THE ONE PIEEEEEEEEEEEEEEEEECE. THE ONE PIECE IS REAAAAAAAAAAAAAAAAAAL.",
  "I'm a perpetual ----ing motion machine"
]

const currentQuote = ref("");
const quote = computed(() => currentQuote)
let usedQuotes: string[] = [];

const japanese = ref(false);


onMounted(() => {
  getQuote(true);
})

// I'd default this, except the click event passes through an entire click event.
// Click events aren't falsey btw :(
// This is a lot of effort to go through just to ensure someone always sees a new quote, but you know what? worth it.
function getQuote(firstTimeRun: boolean) {

  if (!firstTimeRun && quotes.every(q => usedQuotes.includes(q))) {
    console.warn("clear")
    usedQuotes = [];
    usedQuotes.push(currentQuote.value);
  }

  const freshQuotes = quotes.filter(q => !usedQuotes.includes(q));
  currentQuote.value = freshQuotes[Math.floor(Math.random() * freshQuotes.length)]!;
  usedQuotes.push(currentQuote.value);
}


const version = getVersion(__APP_VERSION__);

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
            <FontAwesomeIcon @click="japanese = !japanese" class="clickable" :icon="faEarthAsia" />
            Hi! I'm <a href="https://www.github.com/QualityPuppet">Eve!</a>
          </h1>
          <h1 v-if="japanese">
            <FontAwesomeIcon @click="japanese = !japanese" class="clickable" :icon="faEarthEurope" />
            おはよう! 私は<a href="https://www.github.com/QualityPuppet">エビだよ!</a>
          </h1>
        </el-row>
        <el-row :span="12">
          <el-text size="large">
            <p>
              I enjoy watching anime and statistics, so I wanted to leverage <a href="https://malsync.moe/">MAL-Sync</a>
              (and the coding knowledge I reportedly have) to make a programmatic way of sorting and
              then statistically ranking the anime I've watched.
            </p>
            <br />
            <p>
              As of September 2026, this is the <code>{{ version }}</code> version of the website.
              Version <code>{{ getVersion("1.0.0") }} </code> to <code>{{ getVersion("1.3.1") }}</code> implemented the
              base skeleton for the
              website
            </p>
            <br />
            <p>
              <code>{{ version }}</code> implements a <code>statistics</code> page that leverages a
              normal distribution to map out scores, with an aim to make that editable so the bell curve can be adjusted
              to suit a user's scoring preferences (centred around an approximate average user score)
              clean up some bugs and CSS flaws, then get the anilist sync code working for what, in theory, is a
              finished product.
            </p>
            <br />
            <p>
              Feel free to take a look at the current things I want to implement <a target="_blank"
                href="https://github.com/users/QualityPuppet/projects/2/views/5">here</a>!
            </p>
          </el-text>
        </el-row>
        <!-- TODO: There's gotta be a better way to do this. -->
        <br />
        <el-row :span="12" align="middle">
          <h2>
            <RefreshRight @click="() => getQuote(false)" class="clickable" />
            {{ quote }}
          </h2>
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

.clickable {
  cursor: pointer;
  height: 1em;
  margin-right: 0.5rem
}

.avatar {
  border-radius: 50% !important;
  height: 10em;
}
</style>
