const getDataSource = function (comp) {
  this.designerDataMappingComps.push(comp);
  // 接口
  if (comp.dataType === "interface" && comp.dataURL) {
    //页面数据源
    let designerDataSources = comp.$designer.designerDataSources;
    let val = comp.interface;
    let source = {
      id: val._id,
      label: val.label,
      url: val.url,
      nodeKey: val._id,
      type: "interface",
      params: comp.configAttachRequestParams,
      mapFieldList: comp.interfaceMapFieldList,
      origin: val,
      is_folder: 0,
      isEdit: false,
      children: val.fields
        ? val.fields.map((it) => ({
            id: it.value,
            label: it.name,
            nodeKey: it.id,
            isField: true,
          }))
        : [],
    };
    let index = designerDataSources.findIndex((it) => it.url === source.url);
    if (index < 0) {
      comp.$designer.designerDataSources.push(source);
    } else {
      this.$set(comp.$designer.designerDataSources, index, source);
    }
  }

  //数据源
  if (comp.dataType === "datasource" && comp.dataSource && comp.dataSource.code) {
    //页面数据源
    let designerDataSources = comp.$designer.designerDataSources;
    let val = comp.dataSource;

    let source = {
      id: val._id,
      label: val.label,
      nodeKey: val._id,
      type: "datasource",
      params: comp.dataSourceParams,
      mapFieldList: comp.datasourceMapFieldList,
      origin: val,
      is_folder: 0,
      isEdit: false,
      children: val.fields.map((it) => ({
        id: it.value,
        label: it.name,
        nodeKey: it.value,
        isField: true,
      })),
    };
    let item = designerDataSources.find((it) => it.code === source.code);
    if (!item) {
      comp.$designer.designerDataSources.push(source);
    } else {
      Object.assign(item, source);
    }
  }
  //综合表数据
  if (comp.dataType === "combineTable" && comp.combineTable && comp.combineTableParams && comp.mapFieldList.length) {
    let val = comp.combineTable;
    //页面数据源
    let designerDataSources = comp.$designer.designerDataSources;
    let source = {
      id: val.id,
      label: val.name,
      url: val.url,
      nodeKey: val.id + "-" + val.name,
      type: "combineTable",
      origin: val,
      params: comp.combineTableParams,
      mapFieldList: comp.mapFieldList,
      is_folder: 0,
      isEdit: false,
      children: comp.mapFieldList.map((it) => ({
        id: it.value,
        label: it.name,
        nodeKey: it.id + "-" + it.name,
        isField: true,
      })),
    };
    let item = designerDataSources.find((it) => it.id === source.id && it.label === source.label);
    if (!item) {
      designerDataSources.push(source);
    }
    comp.$designer.designerDataSources = [...designerDataSources];
  }
};
export { getDataSource };
