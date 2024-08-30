/*
* @Author: wqsong2
* @Date: 2024/8/9 15:40
* @Desciption:明细动态列表
*/
<template>
  <div class="detailList">
    <table-list
      :key-list="keyList"
      :show-page="false"
      :father-list="fatherList"
      :heights= heights
      :showIndex="showIndex"
      :scrollbar-alwayson="true"
    ></table-list>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, watch, getCurrentInstance} from 'vue';
import TableList from "@/components/table/tableList.vue";
const { proxy } = getCurrentInstance() as any; // this
const props = defineProps({
  trendsDateType:{
    type:Number,
    default: '',
  },
  trendsSwitch:{
    type:Number,
    default: '',
  },
  formModel:{
    type: Object,
    default: () => {
      return {};
    },
  }
})
const {trendsDateType, trendsSwitch, formModel} = toRefs(props);
const {keyList, fatherList, heights, showIndex} = toRefs(reactive({
  keyList:[],
  fatherList:[],
  heights:0,
  showIndex:true
}))
// 根据切换更改表头和数据源
const changeKeyList = () =>{
  keyList.value = []
  if(trendsDateType.value === 1){
    heights.value = 240;
    showIndex.value = true;
    (keyList as any).value = [
      {name: '指标名称', code: 'indicatorName'},
      {name: '指标服务调用次数', code: 'invokeNum'},
    ]
  }else if(trendsDateType.value === 2){
    heights.value = 200;
    showIndex.value = false;
    (keyList as any).value = [
      {name: trendsSwitch.value === 1 ? '指标名称' : '体系名称', code: 'indicatorName'},
      {name: trendsSwitch.value === 1 ? '指标状态' : '体系状态', code: 'indicatorStatus',width: '100', format: (key: any, row: any) => row.indicatorStatusCode === '1' ?
          '<div class="format">' +
          '<span class="point point-red-bg" :style="{width:64px}"></span>' +
          '<span style="width: 75%" class="ell">' + row[key] +'</span></div>'
          : (row.indicatorStatusCode === '0' || row.indicatorStatusCode === '4') ?
            '<div class="format">' +
            '<span class="point point-green-bg" :style="{width:64px}"></span>' +
            '<span style="width: 75%" class="ell">' + row[key] +'</span></div>'
            : (row.indicatorStatusCode === '2' || row.indicatorStatusCode === '3' )?
              '<div class="format">' +
              '<span class="point point-blue-bg" :style="{width:64px}"></span>' +
              '<span style="width: 75%" class="ell">' + row[key] +'</span></div>'
              : row.indicatorStatusCode === '5'?
                '<div class="format">' +
                '<span class="point point-orange-bg" :style="{width:64px}"></span>' +
                '<span style="width: 75%" class="ell">' + row[key] +'</span></div>'
                : "--"},
      {name: '负责部门', code: 'deptName'},
      {name: '创建时间', code: 'createdTime', width: '180'},
    ]
  }else if(trendsDateType.value === 3){
    heights.value = 200;
    showIndex.value = false;
    (keyList as any).value = [
      {name: trendsSwitch.value === 1 ? '指标名称' : '体系名称', code: 'indicatorName'},
      {name: '更新内容', code: 'updatedContent'},
      {name: '更新人', code: 'updatedUserName'},
      {name: '创建时间', code: 'updatedTime', width: '180'},
    ]
  }
}
// 获取列表数据
const hitIndicator = async() =>{
  fatherList.value = []
  if(trendsDateType.value === 1){
    const {flag,data,errMsg} = await proxy.$api.overview.hitIndicator({deptId: formModel.value.deptId},);
    if(flag){
      data.forEach((item:any)=>{
        item.invokePercent = Number(item.invokePercent.split('%')[0])
      })
      fatherList.value = data
    }else{
      proxy.$message.error(errMsg);
    }
  }else if(trendsDateType.value === 2){
    const {flag,data,errMsg} = await proxy.$api.overview.todoIndicator({category: trendsSwitch.value});
    if(flag){
      fatherList.value = data
    }else{
      proxy.$message.error(errMsg);
    }
  }else if(trendsDateType.value == 3){
    const {flag,data,errMsg} = await proxy.$api.overview.latestIndicator({category: trendsSwitch.value});
    if(flag){
      fatherList.value = data
    }else{
      proxy.$message.error(errMsg);
    }
  }
}
watch(() => [trendsDateType,trendsSwitch], (newVal, oldVal) => {
    changeKeyList()
    hitIndicator()
  },
  { deep: true, immediate: true }
)
</script>

<style scoped lang="scss">
::v-deep .point{
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin-right: 6px;
  &.point-green-bg{
    background-color: #2db66d;
  }
  &.point-blue-bg {
    background-color: #407cff;
  }
  &.point-red-bg {
    background-color: #ff4d4f;
  }
  &.point-orange-bg {
    background-color: #ffa340;
  }
}
::v-deep .index-0,::v-deep .index-1,::v-deep .index-2{
  width: 16px;
  display: inline-block;
  height: 16px;
  border-radius: 100%;
  line-height: 16px;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
}
::v-deep .index-0{
  background-color: #ff3545;
}
::v-deep .index-1{
  background-color: #ff9f15;
}
::v-deep .index-2{
  background-color: #ffc300;
}
.detailList{

}

</style>
