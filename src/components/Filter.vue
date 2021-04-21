<template>
  <div class="filter">
    <h2>
      フィルター
      <el-button
        class="title-icon"
        :icon="open ? `el-icon-arrow-up` : `el-icon-arrow-down`"
        circle
        @click="open = !open"
      >
      </el-button>
    </h2>
    <div v-if="open">
      <template v-if="name">
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
      </template>
      <template v-if="diff">
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
        </p></template
      >
      <template v-if="level">
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
        </p></template
      >
      <template v-if="genre">
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
      </template>
      <template v-if="score">
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
      </template>
      <template v-if="ablamp || fblamp">
        <div class="subtitle">クリアランプ</div>
        <p v-if="ablamp">
          <el-checkbox-group v-model="opts.ablamp">
            <el-checkbox-button
              v-for="opts in abLamp"
              :label="opts.value"
              :key="opts"
              >{{ opts.label }}
            </el-checkbox-button>
          </el-checkbox-group>
        </p>
        <p v-if="fblamp">
          <el-checkbox-group v-model="opts.fblamp">
            <el-checkbox-button
              v-for="opts in fbLamp"
              :label="opts.value"
              :key="opts"
              >{{ opts.label }}
            </el-checkbox-button>
          </el-checkbox-group>
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, reactive, watchEffect, useContext } from "vue";
import type { PlaylogData } from "@/types";
import {
  diffOptions,
  levelOptions,
  genreOptions,
  scoreRank,
  abLamp,
  fbLamp,
} from "./utils";

const props = defineProps<{
  data: PlaylogData;
  update: Function;
  name?: boolean;
  diff?: boolean;
  level?: boolean;
  genre?: boolean;
  score?: boolean;
  ablamp?: boolean;
  fblamp?: boolean;
}>();

const open = ref(false);

const opts = reactive({
  name: "",
  diff: [],
  level: [],
  genre: [],
  score: [],
  ablamp: [],
  fblamp: [],
});

const filter = (data: PlaylogData) => {
  return data.filter((item) => {
    const matchName = opts.name ? item.music_name.includes(opts.name) : true;
    const matchDiff = opts.diff.length ? opts.diff.includes(item.diff) : true;
    const matchGenre = opts.genre.length
      ? opts.genre.includes(item.genre_name)
      : true;
    const matchLevel = opts.level.length
      ? opts.level.includes(item.level_name)
      : true;
    const matchScore = opts.score.length
      ? opts.score.includes(item.rank)
      : true;
    const matchAbLamp = opts.ablamp.length
      ? opts.ablamp.includes(item.ab_lamp)
      : true;
    const matchFbLamp = opts.fblamp.length
      ? opts.fblamp.includes(item.fb_lamp)
      : true;
    return (
      matchName &&
      matchDiff &&
      matchGenre &&
      matchLevel &&
      matchScore &&
      matchAbLamp &&
      matchFbLamp
    );
  });
};

watchEffect(() => {
  props.update(filter(props.data));
});
</script>