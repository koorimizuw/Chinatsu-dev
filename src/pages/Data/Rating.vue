<template>
  <div class="controller">
    <el-switch
      v-if="isMobile()"
      v-model="showDetail"
      active-text="詳細"
      inactive-text="概略"
    >
    </el-switch>
  </div>
  <div v-if="isMobile() && showDetail" class="zoom controller">
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
  <el-card v-for="(cas, i) in cases" :key="i" class="card">
    <template #header>
      <div class="card-header">
        <div class="title">{{ cas.str }}</div>
        <p>
          {{ cas.text }}
        </p>
      </div>
    </template>
    <div style="width: 100%; overflow-x: scroll" v-dragscroll.x>
      <el-table
        :data="rating[cas.name]"
        style="width: fit-content; max-width: fit-content"
        :row-class-name="formatRowClass"
        :style="isMobile() && showDetail ? `zoom: ${zoom};` : ``"
        class="data-table"
      >
        <el-table-column
          prop="music_name"
          label="楽曲名"
          sortable
          :fixed="isMobile() && showDetail"
          :width="tableWidth(320, 210)"
        >
          <template #default="scope">
            <i v-if="!isMobile()" class="el-icon-tickets"></i>
            <i
              v-if="isMobile() && !showDetail"
              class="el-icon-s-flag"
              :class="{ name: !showDetail }"
            ></i>
            <span
              :style="isMobile() && !showDetail ? `margin-left: 10px` : ``"
              >{{ scope.row.music_name }}</span
            >
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
          :width="tableWidth(120, 100)"
          sortable
        >
          <template #default="scope">
            <i v-if="!isMobile()" class="el-icon-video-play"></i>
            <span :style="!isMobile() ? 'margin-left: 10px' : ''">{{
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
          sortable
        />
        <el-table-column
          label="Rt"
          width="70"
          :fixed="isMobile() ? 'right' : false"
        >
          <template #default="scope">
            <span :style="isMax(scope.row.technical_score)">{{
              calcRating(scope.row.technical_score, scope.row.level)
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
  
  <script setup lang="ts">
import { ElLoading } from "element-plus";
import firebase from "firebase";
import router from "@/router";
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { getFunctions, isMobile } from "@/utils";
import {
  cases,
  calcRating,
  foramtDiffName,
  formatRowClass,
  tableWidth,
  isMax,
} from "./util";

const zoom = ref(0.8);

const store = useStore();
const rating = computed(() => store.state.rating);

const average = rating.value.reduce((acc, cur)=> {
  return calcRating(acc.technical_score, cur.level)
})

onMounted(async () => {
  if (!Object.keys(rating.value).length) {
    let loadingInstance = ElLoading.service({ fullscreen: true });
    const ratingData = await getFunctions().httpsCallable("getRatingData")();
    if (ratingData.data) {
      store.dispatch("updateRatingData", ratingData.data);
      loadingInstance.close();
    } else {
      router.push("/data");
      loadingInstance.close();
    }
  }
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
.music-name {
  width: 300px;
}
.el-table {
  .basic {
    .name {
      color: #2e7d32;
    }
    .table-diff {
      background: #81c784 !important;
      border-color: #66bb6a !important;
    }
  }
  .advanced {
    .name {
      color: #f9a825;
    }
    .table-diff {
      background: #ffb74d !important;
      border-color: #ffa726 !important;
    }
  }
  .expert {
    .name {
      color: #ad1457;
    }
    .table-diff {
      background: #f06292 !important;
      border-color: #ec407a !important;
    }
  }
  .master {
    .name {
      color: #7b1fa2;
    }
    .table-diff {
      background: #ba68c8 !important;
      border-color: #ab47bc !important;
    }
  }
  .lunatic {
    .name {
      color: #666;
    }
    .table-diff {
      background: #777 !important;
      border-color: #333 !important;
    }
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
.title {
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

.zoom {
  margin: 0 10px;
}

.controller {
  margin: 5px 10px;
}
</style>