<template>
  <Filter
    :data="detail"
    :update="updateFilteredData"
    name
    diff
    level
    genre
    score
    ablamp
    fblamp
  />
  <div v-if="isMobile()" class="zoom">
    <h2>ズーム</h2>
    <el-slider
      v-model="zoom"
      :min="0.5"
      :max="1.0"
      :step="0.1"
      show-input
      input-size="small"
    >
    </el-slider>
  </div>
  <div style="width: 100%; overflow-x: scroll" v-dragscroll.x>
    <el-table
      :data="pageSlice"
      style="width: fit-content; max-width: fit-content"
      :style="isMobile() ? `zoom: ${zoom};` : ``"
      :row-class-name="formatRowClass"
    >
      <el-table-column
        prop="music_name"
        label="楽曲名"
        sortable
        fixed="left"
        :width="tableWidth(320, 180)"
      >
        <template #default="scope">
          <i v-if="!isMobile()" class="el-icon-tickets"></i>
          <span :style="!isMobile() ? 'margin-left: 10px' : ''">{{
            scope.row.music_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="genre_name" label="カテゴリー" width="125" />
      <el-table-column
        prop="diff"
        label="難易度"
        width="90"
        :formatter="foramtDiffName"
      >
        <template #default="scope">
          <el-tag class="table-diff" size="medium">{{
            foramtDiffName(scope.row)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="譜面定数" width="65" sortable />
      <el-table-column label="FB" width="60">
        <template #default="scope">
          <el-tag v-if="scope.row.is_full_bell" class="fb-tag">FB</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="AB" width="60">
        <template #default="scope">
          <el-tag v-if="scope.row.is_all_break" class="ab-tag">AB</el-tag>
          <el-tag v-if="scope.row.is_full_combo" class="fc-tag">FC</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="technical_score"
        label="スコア"
        :width="tableWidth(120, 105)"
        sortable
      >
        <template #default="scope">
          <i v-if="!isMobile()" class="el-icon-video-play"></i>
          <span :style="!isMobile() ? 'margin-left: 10px' : ''">{{
            scope.row.technical_score.toLocaleString()
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ランク" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.rank" effect="plain">{{
            scope.row.rank
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Rating" width="70">
        <template #default="scope">
          <span>{{
            calcRating(scope.row.technical_score, scope.row.level)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="battle_score"
        label="バトルスコア"
        :width="tableWidth(125, 105)"
        sortable
      >
        <template #default="scope">
          <i v-if="!isMobile()" class="el-icon-video-play"></i>
          <span :style="!isMobile() ? 'margin-left: 10px' : ''">{{
            scope.row.battle_score.toLocaleString()
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="over_damage"
        label="オーバー ダメージ"
        width="90"
      />
    </el-table>
  </div>
  <el-pagination
    :small="isMobile()"
    class="page-nav"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="page"
    :page-sizes="pageSizeOptions"
    :page-size="pageSize"
    :layout="
      isMobile()
        ? `prev, pager, next, jumper`
        : `total, sizes, prev, pager, next, jumper`
    "
    :total="filtered.length"
  >
  </el-pagination>
</template>

<script setup lang="ts">
import { ElLoading } from "element-plus";
import firebase from "firebase";
import router from "@/router";
import { onMounted, computed, ref, reactive } from "vue";
import { useStore } from "vuex";
import { foramtDiffName, formatRowClass, calcRating } from "./util";
import { getFunctions, isMobile } from "@/utils";
import {
  diffOptions,
  scoreRank,
  abLamp,
  fbLamp,
  levelOptions,
  genreOptions,
  tableWidth,
} from "./util";

//@ts-ignore
import Filter from "@/components/Filter.vue";

const filtered = ref([]);
const updateFilteredData = (data) => {
  filtered.value = data;
};

const zoom = ref(0.8);

const page = ref(1);
const pageSizeOptions = ref([50, 100, 200, 300, 400, 500]);
const pageSize = ref(100);

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  page.value = val;
};

const store = useStore();

const detail = computed(() => store.state.detail);
onMounted(async () => {
  if (!detail.value.length) {
    let loadingInstance = ElLoading.service({ fullscreen: true });
    const musicData = await getFunctions().httpsCallable("getMusicData")();
    if (musicData.data.length) {
      store.dispatch("updateMusicData", musicData.data);
      loadingInstance.close();
    } else {
      router.push("/data");
      loadingInstance.close();
    }
  }
});

const pageSlice = computed(() => {
  const data = filtered.value.length ? filtered.value : detail.value;
  const itemStart = (page.value - 1) * pageSize.value;
  const itemEnd =
    itemStart + pageSize.value > data.length
      ? data.length
      : itemStart + pageSize.value;

  return data.slice(itemStart, itemEnd);
});
</script>

<style lang="scss">
.table-diff {
  color: #fff;
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
}

.ab-tag {
  color: #fff;
  background: #ffd54f !important;
  border-color: #ffca28 !important;
}

.fc-tag {
  color: #fff;
  background: #ffeb3b !important;
  border-color: #fdd835 !important;
}

.fb-tag {
  color: #fff;
  background: #80deea !important;
  border-color: #4dd0e1 !important;
}

.table-expand {
  font-size: 0;

  label {
    width: 150px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.title {
  &-icon {
    margin-left: 20px;
  }
}
.subtitle {
  font-size: 1.35em;
}

.page-nav {
  margin-top: 10px;
}

.filter {
  margin: 0 10px;
}
.zoom {
  margin: 0 10px;
}
</style>