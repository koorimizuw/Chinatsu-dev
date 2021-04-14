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
    :data="filtered"
    ref="filterTable"
    style="width: 100%"
    :row-class-name="formatRowClass"
  >
    <el-table-column type="expand">
      <template #default="props">
        <el-form label-position="left" inline class="table-expand">
          <el-form-item label="プレイ日時">
            <span>{{ props.row.play_date }}</span>
          </el-form-item>
          <el-form-item label="楽曲名">
            <span>{{ props.row.music_name }}</span>
          </el-form-item>
          <el-form-item label="難易度">
            <span>{{ foramtDiffName(props.row) }}</span>
          </el-form-item>
          <el-divider />
          <el-form-item label="テクニカルスコア">
            <span>{{ props.row.technical_score.toLocaleString() }}</span>
          </el-form-item>
          <el-form-item label="ABランプ">
            <span>{{ props.ab_lamp }}</span>
          </el-form-item>
          <el-form-item label="FBランプ">
            <span>{{ props.row.fb_lamp }}</span>
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
            <span>{{ props.row.judge_critical_break }}</span>
          </el-form-item>
          <el-form-item label="Break">
            <span>{{ props.row.judge_break }}</span>
          </el-form-item>
          <el-form-item label="Hit">
            <span>{{ props.row.judge_hit }}</span>
          </el-form-item>
          <el-form-item label="Miss">
            <span>{{ props.row.judge_miss }}</span>
          </el-form-item>
          <el-form-item label="Bell">
            <span
              >{{ props.row.bell_count }} /
              {{ props.row.total_bell_count }}</span
            >
          </el-form-item>
          <el-form-item label="ダメージ">
            <span>{{ props.row.damage_count }}</span>
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
    <el-table-column sortable prop="play_date" label="プレイ日時" width="180">
      <template #default="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.play_date }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="music_name" label="楽曲名">
      <template #default="scope">
        <i class="el-icon-tickets"></i>
        <span style="margin-left: 10px">{{ scope.row.music_name }}</span>
      </template>
    </el-table-column>
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
    <el-table-column
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
    <el-table-column label="ランク" width="80">
      <template #default="scope">
        <span>{{ scope.row.rank }}</span>
      </template>
    </el-table-column>
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
      prop="judge_critical_break"
      label="Critical Break"
      width="80"
    >
    </el-table-column>
    <el-table-column prop="judge_break" label="Break" width="65">
    </el-table-column>
    <el-table-column prop="judge_hit" label="Hit" width="60"> </el-table-column>
    <el-table-column prop="judge_miss" label="Miss" width="60">
    </el-table-column>
    <el-table-column prop="place_name" label="店舗"> </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ElLoading } from "element-plus";
import router from "@/router";
import { onMounted, computed, ref, reactive } from "vue";
import { useStore } from "vuex";
import { getFunctions } from "@/utils";
import { foramtDiffName, formatRowClass } from "./util";
import { diffOptions, scoreRank, abLamp, fbLamp } from "./util";

const filterOpen = ref(false);
const opts = reactive({
  diff: [],
  score: [],
  ablamp: [],
  fblamp: [],
});

const store = useStore();

const playlog = computed(() => store.state.playlog);
onMounted(async () => {
  if (playlog.value.length === 0) {
    let loadingInstance = ElLoading.service({ fullscreen: true });
    const playlogData = await getFunctions().httpsCallable("getPlaylog")();
    store.dispatch("updatePlaylog", playlogData.data);
    loadingInstance.close();
  }
  if (playlog.value.length === 0) {
    router.push("/data");
  }
});

const openFilter = () => {
  filterOpen.value = !filterOpen.value;
};

const filtered = computed(() => {
  let tmp = [];
  for (let item of playlog.value) {
    if (opts.diff.length !== 0 && !opts.diff.includes(item.diff)) {
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
</style>