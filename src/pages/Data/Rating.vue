<template>
  <p>
    <el-switch
      v-if="isMobile"
      v-model="showDetail"
      active-text="詳細"
      inactive-text="概略"
    >
    </el-switch>
  </p>
  <el-card v-for="(cas, i) in cases" :key="i" class="card">
    <template #header>
      <div class="card-header">
        <div class="name">{{ cas.str }}</div>
        <p>
          {{ cas.text }}
        </p>
      </div>
    </template>
    <el-table
      :data="rating[cas.name]"
      ref="filterTable"
      style="width: 100%"
      :row-class-name="formatRowClass"
      class="data-table"
    >
      <el-table-column
        prop="music_name"
        label="楽曲名"
        sortable
        :width="musicNameWidth"
      >
        <template #default="scope">
          <i v-if="showDetail" class="el-icon-tickets"></i>
          <span :style="showDetail ? 'margin-left: 10px' : ''">{{
            scope.row.music_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showDetail"
        prop="genre_name"
        label="カテゴリー"
        width="130"
      />
      <el-table-column
        prop="diff"
        label="難易度"
        width="90"
        v-if="showDetail"
        :formatter="foramtDiffName"
      >
        <template #default="scope">
          <el-tag class="table-diff" size="medium">{{
            foramtDiffName(scope.row)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="technical_score"
        label="スコア"
        :width="scoreWidth"
        sortable
      >
        <template #default="scope">
          <i v-if="showDetail" class="el-icon-video-play"></i>
          <span :style="showDetail ? 'margin-left: 10px' : ''">{{
            scope.row.technical_score.toLocaleString()
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ランク" width="80" v-if="showDetail">
        <template #default="scope">
          <el-tag v-if="scope.row.rank" effect="plain">{{
            scope.row.rank
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showDetail"
        prop="level"
        label="譜面定数"
        width="60"
      />
      <el-table-column
        label="Rating"
        width="70"
        :fixed="isMobile ? 'right' : false"
      >
        <template #default="scope">
          <span :style="isMax(scope.row.technical_score)">{{
            calcRating(scope.row.technical_score, scope.row.level)
          }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
  
  <script setup lang="ts">
import { ElLoading } from "element-plus";
import firebase from "firebase";
import router from "@/router";
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { calcRating, foramtDiffName, formatRowClass } from "./util";
import { getFunctions } from "@/utils";

const store = useStore();

const cases = [
  {
    name: "new",
    str: "新曲枠",
    text:
      "現バージョンで追加された楽曲の内、テクニカルスコアによるレーティング値が高い順に15曲が表示されます。",
  },
  {
    name: "best",
    str: "ベスト枠",
    text:
      "以前のバージョンで追加された楽曲の内、テクニカルスコアによるレーティング値が高い順に30曲が表示されます。",
  },
  {
    name: "recent",
    str: "リーセント枠",
    text:
      "最近遊んだ楽曲の内、テクニカルスコアによるレーティング値が高い10曲が表示されます。（テクニカルハイスコアとは異なる数値が表示されます。）",
  },
  {
    name: "candidate",
    str: "候補曲",
    text:
      "全楽曲のレーティング対象（新曲）（ベスト）に入っていない曲の内、テクニカルスコアによるレーティング値が高い順に最大20曲が表示されます。",
  },
];
const rating = computed(() => store.state.rating);
onMounted(async () => {
  if (Object.keys(rating.value).length === 0) {
    let loadingInstance = ElLoading.service({ fullscreen: true });
    const ratingData = await getFunctions().httpsCallable("getRatingData")();
    store.dispatch("updateRatingData", ratingData.data);
    loadingInstance.close();
  }
  if (rating.value.length === 0) {
    router.push("/data");
  }
});

const isMobile = computed(() => {
  if (window.innerWidth <= 600) {
    console.log("ismobile");
    return true;
  }
  return false;
});

const showDetailInfo = computed(() => {
  if (isMobile.value) {
    return false;
  }
  return true;
});
const showDetail = ref(showDetailInfo.value);

const musicNameWidth = computed(() => {
  if (isMobile.value) {
    return 180;
  }
  return 320;
});
const scoreWidth = computed(() => {
  if (isMobile.value) {
    return 100;
  }
  return 120;
});

const isMax = (score: number) => {
  return score >= 1007500 ? "font-weight: 800;" : "";
};
</script>

<style lang="scss">
.table-diff {
  color: #fff;
}
.music-name {
  width: 300px;
}
.el-table {
  .basic .table-diff {
    background: #81c784 !important;
    border-color: #66bb6a !important;
  }
  .advanced .table-diff {
    background: #ffb74d !important;
    border-color: #ffa726 !important;
  }
  .expert .table-diff {
    background: #f06292 !important;
    border-color: #ec407a !important;
  }
  .master .table-diff {
    background: #ba68c8 !important;
    border-color: #ab47bc !important;
  }
  .lunatic .table-diff {
    background: #777 !important;
    border-color: #333 !important;
  }

  .music-name {
    min-width: 300px;
  }
}

@media (max-width: 768px) {
  .el-card__body {
    padding: 5px;
  }
}
</style>

<style lang="scss" scoped>
.card {
  margin-bottom: 20px;
}
.name {
  margin-top: 10px;
  font-size: 1.6em;
}

.info-row {
  display: flex;
  margin: 10px 0;
  font-size: 0.9em;
  color: #555;
  :first-child {
    width: 200px;
  }
}
</style>