<template>
  <div class="filter">
    <h2>
      フィルター
      <el-button
        class="title-icon"
        :icon="filterOpen ? `el-icon-arrow-up` : `el-icon-arrow-down`"
        circle
        @click="openFilter"
      >
      </el-button>
    </h2>
    <div v-if="filterOpen">
      <div class="subtitle">曲名</div>
      <p>
        <el-input
          placeholder="曲名で絞り込む"
          v-model="opts.name"
          clearable
          style="max-width: 500px"
        >
        </el-input>
      </p>
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
  </div>
  <div style="width: 100%; overflow-x: scroll" v-dragscroll.x>
    <el-table
      :data="filtered"
      style="width: fit-content; max-width: fit-content"
    >
      <el-table-column type="expand" :width="tableWidth(45, 30)">
        <template #default="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="プレイ日時">
              <span>{{ props.row.play_date }}</span>
            </el-form-item>
            <el-form-item label="楽曲名">
              <span>{{ props.row.music_name }}</span>
            </el-form-item>
            <el-form-item label="難易度">
              <el-tag
                class="table-diff"
                :class="formatRowClass(props)"
                size="small"
                >{{ foramtDiffName(props.row) }}</el-tag
              >
            </el-form-item>
            <el-divider />
            <el-form-item label="テクニカルスコア">
              <span>{{ props.row.technical_score.toLocaleString() }}</span>
            </el-form-item>
            <el-form-item label="譜面定数">
              <span>{{ props.row.level }}</span>
            </el-form-item>
            <el-form-item label="レーティング">
              <span :style="isMax(props.row.technical_score)">{{
                calcRating(props.row.technical_score, props.row.level)
              }}</span>
            </el-form-item>
            <el-form-item label="ランク">
              <el-tag v-if="props.row.rank" size="small" effect="plain">{{
                props.row.rank
              }}</el-tag>
            </el-form-item>
            <el-form-item label="ABランプ">
              <el-tag v-if="props.row.is_all_break" size="small" class="ab-tag"
                >AB
              </el-tag>
              <el-tag v-if="props.row.is_full_combo" size="small" class="fc-tag"
                >FC
              </el-tag>
            </el-form-item>
            <el-form-item label="FBランプ">
              <el-tag v-if="props.row.is_full_bell" size="small" class="fb-tag"
                >FB
              </el-tag>
            </el-form-item>
            <el-divider />
            <el-form-item label="バトルスコア">
              <span>{{ props.row.battle_score.toLocaleString() }}</span>
            </el-form-item>
            <el-form-item label="オーバーダメージ">
              <span>{{ props.row.over_damage }}</span>
            </el-form-item>
            <el-form-item label="ボスキャラ">
              <span>{{ props.row.boss_chara }}</span>
            </el-form-item>
            <el-form-item label="ボスレベル">
              <span>{{ props.row.boss_level }}</span>
            </el-form-item>
            <el-divider />
            <el-form-item label="Critical Break">
              <el-tag size="small" class="critical-break">{{
                props.row.judge_critical_break
              }}</el-tag>
            </el-form-item>
            <el-form-item label="Break">
              <el-tag size="small" class="break">{{
                props.row.judge_break
              }}</el-tag>
            </el-form-item>
            <el-form-item label="Hit">
              <el-tag size="small" class="hit">{{
                props.row.judge_hit
              }}</el-tag>
            </el-form-item>
            <el-form-item label="Miss">
              <el-tag size="small" class="miss">{{
                props.row.judge_miss
              }}</el-tag>
            </el-form-item>
            <el-form-item label="Bell">
              <el-tag type="warning" size="small">
                <i class="el-icon-bell"></i>
                {{ props.row.bell_count }} /
                {{ props.row.total_bell_count }}
              </el-tag>
            </el-form-item>
            <el-form-item label="ダメージ">
              <el-tag type="danger" size="small">{{
                props.row.damage_count
              }}</el-tag>
            </el-form-item>
            <el-form-item label="最大Combo数">
              <span>{{ props.row.max_combo }}</span>
            </el-form-item>
            <el-divider />
            <el-form-item label="プレイ店舗">
              <span>{{ props.row.place_name }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="play_date"
        label="プレイ日時"
        :width="tableWidth(180, 155)"
      >
        <template #default="scope">
          <i v-if="showDetail" class="el-icon-time"></i>
          <span :style="showDetail ? 'margin-left: 10px' : ''">{{
            scope.row.play_date
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="music_name"
        label="楽曲名"
        :width="tableWidth(300, 170)"
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
        width="120"
      />
      <el-table-column
        v-if="showDetail"
        prop="diff"
        label="難易度"
        width="90"
        :formatter="foramtDiffName"
      >
        <template #default="scope">
          <el-tag
            class="table-diff"
            :class="formatRowClass(scope)"
            size="medium"
            >{{ foramtDiffName(scope.row) }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="showDetail"
        prop="technical_score"
        label="テクニカルスコア"
        width="140"
      >
        <template #default="scope">
          <i class="el-icon-video-play"></i>
          <span style="margin-left: 10px">{{
            scope.row.technical_score.toLocaleString()
          }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showDetail" label="ランク" width="80">
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
      <el-table-column v-if="showDetail" label="Rating" width="70">
        <template #default="scope">
          <span :style="isMax(scope.row.technical_score)">{{
            calcRating(scope.row.technical_score, scope.row.level)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showDetail" label="FB" width="60">
        <template #default="scope">
          <el-tag v-if="scope.row.is_full_bell" class="fb-tag">FB</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="showDetail" label="AB" width="60">
        <template #default="scope">
          <el-tag v-if="scope.row.is_all_break" class="ab-tag">AB</el-tag>
          <el-tag v-if="scope.row.is_full_combo" class="fc-tag">FC</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        prop="battle_score"
        label="バトルスコア"
        width="160"
      >
        <template #default="scope">
          <span>{{ scope.row.battle_score.toLocaleString() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showDetail"
        prop="judge_critical_break"
        label="Critical Break"
        width="80"
      >
        <template #default="scope">
          <span class="critical-break">{{
            scope.row.judge_critical_break
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showDetail"
        prop="judge_break"
        label="Break"
        width="65"
      >
        <template #default="scope">
          <span class="break">{{ scope.row.judge_break }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showDetail"
        prop="judge_hit"
        label="Hit"
        width="60"
      >
        <template #default="scope">
          <span class="hit">{{ scope.row.judge_hit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showDetail"
        prop="judge_miss"
        label="Miss"
        width="60"
      >
        <template #default="scope">
          <span class="miss">{{ scope.row.judge_miss }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showDetail"
        prop="place_name"
        label="店舗"
        :width="tableWidth(200, 100)"
      />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ElLoading } from "element-plus";
import router from "@/router";
import { onMounted, computed, ref, reactive } from "vue";
import { useStore } from "vuex";
import { getFunctions, isMobile } from "@/utils";
import {
  foramtDiffName,
  formatRowClass,
  calcRating,
  tableWidth,
  isMax,
} from "./util";
import { diffOptions, scoreRank, genreOptions, abLamp, fbLamp } from "./util";

const filterOpen = ref(false);
const opts = reactive({
  name: "",
  diff: [],
  score: [],
  genre: [],
  ablamp: [],
  fblamp: [],
});

const store = useStore();

const playlog = computed(() => store.state.playlog);
onMounted(async () => {
  if (!playlog.value.length) {
    let loadingInstance = ElLoading.service({ fullscreen: true });
    const playlogData = await getFunctions().httpsCallable("getPlaylog")();
    if (playlogData.data.length) {
      store.dispatch("updatePlaylog", playlogData.data);
      loadingInstance.close();
    } else {
      router.push("/data");
      loadingInstance.close();
    }
  }
});

const openFilter = () => {
  filterOpen.value = !filterOpen.value;
};

const filtered = computed(() => {
  let tmp = [];
  for (let item of playlog.value) {
    if (opts.name && !item.music_name.includes(opts.name)) {
      continue;
    }
    if (opts.diff.length !== 0 && !opts.diff.includes(item.diff)) {
      continue;
    }
    if (opts.genre.length !== 0 && !opts.genre.includes(item.genre_name)) {
      continue;
    }
    if (opts.score.length !== 0 && !opts.score.includes(item.rank)) {
      continue;
    }
    if (opts.ablamp.length !== 0 && !opts.ablamp.includes(item.ab_lamp)) {
      continue;
    }
    if (opts.fblamp.length !== 0 && !opts.fblamp.includes(item.fb_lamp)) {
      continue;
    }
    tmp.push(item);
  }
  return tmp;
});

const showDetailInfo = computed(() => {
  if (isMobile()) {
    return false;
  }
  return true;
});
const showDetail = ref(showDetailInfo.value);
</script>

<style lang="scss">
.table-diff {
  color: #fff;
}
.el-table {
  .basic.table-diff {
    background: #81c784 !important;
    border-color: #66bb6a !important;
  }
  .advanced.table-diff {
    background: #ffb74d !important;
    border-color: #ffa726 !important;
  }
  .expert.table-diff {
    background: #f06292 !important;
    border-color: #ec407a !important;
  }
  .master.table-diff {
    background: #ba68c8 !important;
    border-color: #ab47bc !important;
  }
  .lunatic.table-diff {
    background: #777 !important;
    border-color: #333 !important;
  }
}

.el-tag {
  &.critical-break {
    color: #fff;
    background: #f9a825 !important;
    border-color: #f57f17 !important;
  }
  &.break {
    color: #fff;
    background: #ff8f00 !important;
    border-color: #ff6f00 !important;
  }
  &.hit {
    color: #fff;
    background: #0288d1 !important;
    border-color: #0277bd !important;
  }
  &.miss {
    color: #fff;
    background: #888 !important;
    border-color: #666 !important;
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

.el-table__expanded-cell {
  @media (max-width: 480px) {
    padding: 20px !important;
  }
}

.table-expand {
  font-size: 0;

  label {
    width: 150px;
    color: #99a9bf;
    @media (max-width: 480px) {
      width: 135px;
      line-height: 28px;
    }
  }
  .el-form-item__content {
    @media (max-width: 480px) {
      line-height: 28px;
    }
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    display: flex;
  }
}

.el-table__body {
  @media (max-width: 480px) {
    width: 100% !important;
  }
}
.el-table__header {
  @media (max-width: 480px) {
    width: 100% !important;
  }
}
</style>

<style lang="scss" scoped>
.el-divider {
  @media (max-width: 480px) {
    margin: 10px 0 !important;
  }
}

.title {
  &-icon {
    margin-left: 20px;
  }
}
.subtitle {
  font-size: 1.35em;
}

.filter {
  margin: 0 10px;
}
</style>