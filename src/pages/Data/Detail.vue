<template>
  <h2>
    フィルター<el-button
      class="title-icon"
      :icon="filterOpen ? `el-icon-arrow-up` : `el-icon-arrow-down`"
      circle
      @click="openFilter"
    ></el-button>
  </h2>
  <div v-if="filterOpen">
    <div class="subtitle">難易度</div>
    <p>
      <el-checkbox-group v-model="opts.diff">
        <el-checkbox-button
          v-for="opts in diffOptions"
          :label="opts.value"
          :key="opts"
          >{{ opts.label }}
        </el-checkbox-button>
      </el-checkbox-group>
    </p>
    <div class="subtitle">レベル</div>
    <p>
      <el-checkbox-group v-model="opts.level">
        <el-checkbox-button
          v-for="opts in levelOptions"
          :label="opts"
          :key="opts"
          >{{ opts }}
        </el-checkbox-button>
      </el-checkbox-group>
    </p>
    <div class="subtitle">ジャンル</div>
    <p>
      <el-checkbox-group v-model="opts.genre">
        <el-checkbox-button
          v-for="opts in genreOptions"
          :label="opts"
          :key="opts"
          >{{ opts }}
        </el-checkbox-button>
      </el-checkbox-group>
    </p>
    <div class="subtitle">スコアランク</div>
    <p>
      <el-checkbox-group v-model="opts.score">
        <el-checkbox-button
          v-for="opts in scoreRank"
          :label="opts.value"
          :key="opts"
          >{{ opts.label }}
        </el-checkbox-button>
      </el-checkbox-group>
    </p>
    <div class="subtitle">クリアランプ</div>
    <p>
      <el-checkbox-group v-model="opts.ablamp">
        <el-checkbox-button
          v-for="opts in abLamp"
          :label="opts.value"
          :key="opts"
          >{{ opts.label }}
        </el-checkbox-button>
      </el-checkbox-group>
    </p>
    <p>
      <el-checkbox-group v-model="opts.fblamp">
        <el-checkbox-button
          v-for="opts in fbLamp"
          :label="opts.value"
          :key="opts"
          >{{ opts.label }}
        </el-checkbox-button>
      </el-checkbox-group>
    </p>
  </div>
  <el-table
    :data="pageSlice"
    ref="filterTable"
    style="width: 100%"
    :row-class-name="formatRowClass"
  >
    <el-table-column prop="music_name" label="楽曲名" width="320" sortable>
      <template #default="scope">
        <i class="el-icon-tickets"></i>
        <span style="margin-left: 10px">{{ scope.row.music_name }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="genre_name" label="カテゴリー" width="130" />
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
    <el-table-column prop="level" label="譜面定数" width="60" />
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
      label="テクニカルスコア"
      width="140"
      sortable
    >
      <template #default="scope">
        <i class="el-icon-video-play"></i>
        <span style="margin-left: 10px">{{
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
      width="140"
      sortable
    >
      <template #default="scope">
        <i class="el-icon-video-play"></i>
        <span style="margin-left: 10px">{{
          scope.row.battle_score.toLocaleString()
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="over_damage" label="オーバー ダメージ" width="90" />
  </el-table>
  <el-pagination
    class="page-nav"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="page"
    :page-sizes="pageSizeOptions"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
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
import { getFunctions } from '@/utils'
import {
  diffOptions,
  scoreRank,
  abLamp,
  fbLamp,
  levelOptions,
  genreOptions,
} from "./util";

const page = ref(1);
const pageSizeOptions = ref([50, 100, 200, 300, 400, 500]);
const pageSize = ref(100);

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  page.value = val;
};

const filterOpen = ref(false);
const opts = reactive({
  diff: [2, 3, 10],
  score: [],
  ablamp: [],
  fblamp: [],
  level: [],
  genre: [],
});

const store = useStore();

const detail = computed(() => store.state.detail);
onMounted(async () => {
  if (detail.value.length === 0) {
    let loadingInstance = ElLoading.service({ fullscreen: true });
    const musicData = await getFunctions().httpsCallable("getMusicData")();
    store.dispatch("updateMusicData", musicData.data);
    loadingInstance.close();
  }
  if (detail.value.length === 0) {
    router.push("/data");
  }
});

const openFilter = () => {
  filterOpen.value = !filterOpen.value;
};

const filtered = computed(() => {
  let items = [];
  for (let item of detail.value) {
    if (opts.diff.length !== 0 && !opts.diff.includes(item.diff)) {
      continue;
    }
    if (opts.score.length !== 0 && !opts.score.includes(item.rank)) {
      continue;
    }
    if (opts.genre.length !== 0 && !opts.genre.includes(item.genre_name)) {
      continue;
    }
    if (opts.ablamp.length !== 0 && !opts.ablamp.includes(item.ab_lamp)) {
      continue;
    }
    if (opts.fblamp.length !== 0 && !opts.fblamp.includes(item.fb_lamp)) {
      continue;
    }
    if (opts.level.length !== 0 && !opts.level.includes(item.level_name)) {
      continue;
    }
    items.push(item);
  }

  return items;
});

const pageSlice = computed(() => {
  const itemStart = (page.value - 1) * pageSize.value;
  const itemEnd =
    itemStart + pageSize.value > filtered.value.length
      ? filtered.value.length
      : itemStart + pageSize.value;

  return filtered.value.slice(itemStart, itemEnd);
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
</style>