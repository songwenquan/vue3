/* * @Author: wqsong2 * @Date: 2023/11/22 15:19 * @Desciption:列表通用组件 */
<template>
  <div class="tableList">
    <el-table
      ref="table"
      :scrollbar-always-on="scrollbarAlwayson"
      :data="fatherList.length > 0 ? fatherList : listData"
      :header-cell-style="headerCellStyle"
      :border="border"
      @expand-change="expandChange"
      :row-key="getRowKeys"
      :expand-row-keys="expandRowKeys"
      :row-class-name="tableRowClassName"
      @select="selectRow"
      @select-all="selectAll"
      @current-change="rowCurrentChange"
      :height = 'heights !== "" ? heights : "auto"'
    >
      <el-table-column type="expand" v-if="showExpand">
        <template #default="props">
          <el-table :data="props.row.expandData" class="table_child">
            <el-table-column v-for="(item, index1) in expandKey" :width="item.width" show-overflow-tooltip :key="index1" :label="item.name">
              <template #default="scope1">
                <span>{{ scope1.row[item.code] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column v-if="multiple"  type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="80" v-if="showIndex" label="序号">
        <template #default="scope">
          <span :class="'index-' + scope.$index">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        :fixed="item.fixeds"
        :label="item.name"
        :min-width="item.minWidth"
        :width="item.width"
        v-for="(item, index) in keyList"
        :key="index"
        align="center"
      >
        <template #default="scope">
          <div :class="item.click ? 'cursor-p color-1F75FF' : ''" @click="item.click ? item.click(scope.row) : ''" class="ell">
            <div v-if="item.format" v-dompurify-html="item.format(item.code, scope.row)"></div>
            <ex-slot v-else-if="item.render" :render="item.render" :row="scope.row" :index="scope.$index" :column="item" />
            <span v-else>{{ scope.row[item.code] || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="btnObj.name" :width="btnObj.width" :fixed="btnObj.fiexd || false" v-if="btnObj.name" align="center">
        <template #default="scope">
          <el-button
            v-for="(item, index) in btnObj.list"
            v-show="item.hide === undefined ? true : item.hide"
            :key="index"
            @click="handleClick(scope.row, item.callBackName, scope.$index, fatherList.length > 0 ? fatherList : listData)"
            :disabled="!btnStatus(scope.row, item)"
            :type="item.type || 'primary'"
            link
            :icon="item.icons"
          >
            {{ item.name }}
            <el-icon v-if="scope.row.attrFileDtoList && scope.row.attrFileDtoList.length > 0 && item.icon"><Check /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrap tr mt10" v-if="listData.length > 0 && showPage">
      <el-pagination
        background
        :current-page="pager.pageNum"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="Number(total)"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="->,total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, nextTick, getCurrentInstance, ref } from 'vue';
const { proxy } = getCurrentInstance() as any; // this
const exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h: any) => {
    const params: any = {
      row: h.row,
      index: h.index,
    };
    if (h.column) {
      params.column = h.column;
    }
    return h.render(params);
  },
};
const props = defineProps({
  heights:{
    type: [String,Number],
    default: '',
  },
  // 父级传递数据
  fatherList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 展开行参数
  expandCode: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 展开行展示字段
  expandKey: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 列表展示项数据
  keyList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 附加入参
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 是否展示分页
  showPage: {
    type: Boolean,
  },
  // 接口service
  service: {
    type: [String,Function],
    default: '',
  },
  // 接口api
  api: {
    type: String,
    default: '',
  },
  // 获取class
  getTableRowClassName: {
    type: Function,
  },
  // 展开列表数据 二次处理
  expandHandleData: {
    type: Function,
  },
  // 是否显示展开行
  showExpand: {
    type: Boolean,
  },
  // 是否展示序号
  showIndex: {
    type: Boolean,
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  // 是否在数据更新之后保留之前选中的数据
  reserveSelection: {
    type: Boolean,
    default: false,
  },
  // 操作按钮相关
  btnObj: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 按钮显示逻辑
  btnShow: {
    type: Function,
  },
  // 页码切换数组
  pageSizes: {
    type: Array,
    default: () => {
      return [10, 20, 50, 100];
    },
  },
  // 一页个数
  pageSize: {
    type: Number,
    default: 10,
  },
  // 数据二次处理
  handleData: {
    type: Function,
  },
  // 接口api扩展列
  expandApi: {
    type: String,
    default: '',
  },
  rowKey: {
    type: String,
    default: '',
  },
  // 当前行点击
  handleRowCurrentChange: {
    type: Function,
  },
  // 是否存在边框可以拖动
  border: {
    type: Boolean,
    default: false,
  },
  // 是否总是显示滚动条
  scrollbarAlwayson:{
    type: Boolean,
    default: false,
  },
});
const {
  heights,
  fatherList,
  expandCode,
  expandKey,
  keyList,
  params,
  showPage,
  service,
  api,
  showExpand,
  showIndex,
  multiple,
  reserveSelection,
  btnObj,
  pageSizes,
  pageSize,
  expandApi,
  rowKey,
  border,
  scrollbarAlwayson
} = toRefs(props);
const { expandRowKeys, pager, param, total, listData, select, headerCellStyle, } = toRefs(
  reactive({
    param: {},
    expandRowKeys: [],
    pager: {
      // 分页
      pageNo: 1,
      pageSize: 1,
    },
    total: 0, // 列表总数
    listData: [], // 列表数据
    select: [], // 列表选中数据
    headerCellStyle:{
      background: '#FAFAFB'
    }
  })
);
const init = () => {
  getList();
};
const changeDrawer = (title: any, key: any, data: any) => {
  console.log(title, key, data);
};
// 列表数据初始化 定制化
const getList = () => {
  expandRowKeys.value = [];
  nextTick(() => {
    param.value = showPage.value ? Object.assign({}, pager.value, params.value) : params.value;
    delete (param as any).value.receiveTime;
    delete (param as any).value.acceptTime;
    service.value && api.value && proxy.$api[service.value][api.value](param.value).then(async (res: any) => {
      if (res.flag) {
        if (props.handleData) {
          listData.value = props.handleData(res)[0];
          total.value = showPage.value ? props.handleData(res)[1] : 0;
        } else {
          listData.value = res.data.rows;
          total.value = res.data.total
        }
        nextTick(() => {
          multiple.value && setCheckedRows();
        });
      } else {
        proxy.ElMessage.error(res.data.errMsg);
        listData.value = [];
      }
    });
  });
};
// 某行自定义class名字
const tableRowClassName = (row: any, rowIndex: number) => {
  // console.log(row, rowIndex);
  if (props.getTableRowClassName) {
    return props.getTableRowClassName(row);
  } else {
    return '';
  }
};
// 展开行功能
// 展开行
const expandChange = (a: any, expanded: any) => {
  if (expanded.includes(a)) {
    const params: any = {};
    expandCode.value.forEach((item1: any) => {
      params[item1] = a[item1];
    });
    params.currentPageNo = 1;
    params.pageSize = 10;
    expandApi.value &&
    eval(`proxy.$api.${expandApi.value}`)(params).then(async (res: any) => {
      if (res.flag) {
        if (props.expandHandleData) {
          res.data = props.expandHandleData(res.data);
        }
        a.expandData = res.data;
      } else {
        throw new Error(res.message);
      }
    });
  }
};
// 获取row的key值
const getRowKeys = (row: any) => {
  return row[rowKey.value];
};
// 列表按钮是否显示
const btnStatus = (item: any, btn: any) => {
  if (props.btnShow) {
    return props.btnShow(item, btn);
  } else {
    return true;
  }
};
const emit = defineEmits(['handleClick']);
// 列表按钮点击
const handleClick = (item: any, callBackName: any, index: any, scope: any) => {
  emit('handleClick', item, callBackName, index, scope);
};
// 分页大小变更
const handleSizeChange = (val: any) => {
  pager.value.pageSize = val;
  getList();
};
// 翻页事件
const handleCurrentChange = (val: any) => {
  pager.value.pageNo = val;
  getList();
};
// 全选勾选列表操作
const selectAll = (selection: any) => {
  if (selection.length > 0) {
    // 选中
    selection.forEach((item: never) => {
      if (!select.value.some((child) => child[rowKey.value] === item[rowKey.value])) {
        select.value.push(item);
      }
    });
  } else {
    select.value = select.value.filter((item: any) => !listData.value.some((obj: any) => obj[rowKey.value] === item[rowKey.value]));
  }
};
// 行数据勾选
const selectRow = (selection: any, row: never) => {
  if (selection.some((item: any) => item[rowKey.value] === row[rowKey.value])) {
    // 选中添加
    if (!select.value.some((child: any) => child[rowKey.value] === row[rowKey.value])) {
      select.value.push(row);
    }
  } else {
    // 删除
    select.value = select.value.filter((item) => item[rowKey.value] !== row[rowKey.value]);
  }
};
// 回显已勾选的数据
const table: any = ref(null);
const setCheckedRows = () => {
  if(!reserveSelection.value){
    return false
  }
  listData.value.forEach((item: any) => {
    select.value.forEach((child: any) => {
      if (item[rowKey.value] === child[rowKey.value]) {
        table.value.toggleRowSelection(item, true);
      }
    });
  });
};
// 行点击
const rowCurrentChange = (item: any) => {
  props.handleRowCurrentChange && props.handleRowCurrentChange(item);
};
// 传递调用方法
defineExpose({
  init,
  select,
  changeDrawer,
});
</script>

<style scoped lang="scss">
::v-deep .el-table--border, .el-table--group{
  border: 1px solid #EBEEF5 !important ;
}
.tableList {
  :deep(.format) {
    display: flex;
    align-items: center;
    span {
      display: inline-block;
    }
  }
}
</style>
