<template>
  <div class="wrapper">
    <div class="content">
      <h1>Neural Network Football Result Predictions</h1>
      <div class="fixtures">
        <h2>Premier League Preditions: Gameweek {{ $route.params.gameweek }}</h2>
        <div
          v-for="({ fixture, prediction }) in fixtures"
          :key="fixture.id"
          class="fixture">
          <h3>{{ fixture.homeTeam.name }} vs {{ fixture.awayTeam.name }}</h3>
          <div
            class="predictor">
            <div
              :style="{ width: `${prediction.home * 100}%` }"
              :class="`predictor__line predictor__line--${ranking(prediction, 'home')}`">
              {{ floor(prediction.home) }}%
              <div class="label">Home Win</div>
            </div>
            <div
              :style="{ width: `${prediction.draw * 100}%` }"
              :class="`predictor__line predictor__line--${ranking(prediction, 'draw')}`">
              {{ floor(prediction.draw) }}%
              <div class="label">Draw</div>
            </div>
            <div
              :style="{ width: `${prediction.away * 100}%` }"
              :class="`predictor__line predictor__line--${ranking(prediction, 'away')}`">
              {{ floor(prediction.away) }}%
              <div class="label">Away Win</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <section>
        <h2>Github</h2>
        <p>
          <a href="https://github.com/samternent/football-predictor">Github</a>
        </p>
      </section> -->
    </div>
  </div>
</template>
<script>

const colors = [
  'red',
  'yellow',
  'green',
];

export default {
  async asyncData({ app, params }) {
    const fixtures = await import(`@/data/${params.gameweek}`);
    return { fixtures: fixtures.default };
  },
  methods: {
    ranking: (prediction, type) => Object.keys(prediction)
      .sort((a, b) => prediction[a] - prediction[b])
      .map((item, i) => item).indexOf(type),
    floor: (val) => Math.round(val * 100),
  },
}

</script>
<style lang="scss" scoped>

  h1 {
    background-color: #333;
    padding: 17px;
    color: #fefefe;
  }

  h2 {
    background-color: #6c6c6c;
    padding: 17px;
    margin: 10px 0;
    color: #eee;
    display: inline-block;
  }

  h3 {
    border: 2px solid #333;
    padding: 17px;
    margin: 3px;
    margin-left: 13px;
    color: #333;
    display: inline-block;
  }

  .content {
    // background: #eee;
  }

  .fixture {
    margin: 2em 0 1em;
    padding: 1em 0 3em;
    background-color: #fefefe;
    border-bottom: 1px solid #eee;

    &:last-child {
      border: 0;
    }
  }

  .predictor {
    display: flex;
    justify-content: center;
    position: relative;
    margin-top: 4em;
    font-weight: bold;
  }
  .predictor__line {
    text-align: center;
    position: relative;
    color: #fff;
    .label {
      position: absolute;
      top: -1em;
      left: 20%;
    }
    &--2 {
      background-color: #46B085;
      font-size: 2em;

      .label { color: #46B085; }
    }
    &--1 {
      background-color: #FFCF63;
      font-size: 1em;
      color: #666;

      .label { color: #FFCF63; }
    }
    &--0 {
      background-color: #F45B69;
      font-size: 0.8em;

      .label { color: #F45B69; }
    }
  }

@media (min-width: 640px){
  .content {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
}

@media (min-width: 1024px){
 .content {
    width: 60%;
    margin: 0 auto;
    // text-align: center;
  }
}
</style>
