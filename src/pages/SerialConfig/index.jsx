import React, { Component, Fragment, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { ExtTable, utils, ExtIcon } from 'seid'
import { constants } from "@/utils";
import FormModal from "./FormModal";
import styles from "./index.less";

const { APP_MODULE_BTN_KEY, SERVER_PATH } = constants;
const { authAction } = utils;

@withRouter
@connect(({ serialConfig, loading, }) => ({ serialConfig, loading, }))
class SerialConfig extends Component {
  state = {
    delRowId: null,
  }

  add = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "serialConfig/updateState",
      payload: {
        showModal: true,
        rowData: null
      }
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: "serialConfig/updateState",
      payload: {
        showModal: true,
        rowData: rowData
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "serialConfig/save",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "serialConfig/updateState",
          payload: {
            showModal: false
          }
        });
        this.tableRef.remoteDataRrefresh();
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState({
      delRowId: record.id
    }, _ => {
      dispatch({
        type: "serialConfig/del",
        payload: {
          id: record.id
        },
      }).then(res => {
        if (res.success) {
          this.setState({
            delRowId: null
          });
          this.tableRef.remoteDataRrefresh();
        }
      });
    });
  };

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "serialConfig/updateState",
      payload: {
        showModal: false,
        rowData: null
      }
    });
  };

  renderDelBtn = (row) => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects["serialConfig/del"] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  getExtableProps = () => {
    const { list } = this.state;
    const { loading } = this.props;
    const columns = [
      {
        title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
        key: "operation",
        width: 100,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (text, record) => (
          <span className={cls("action-box")}>
            {
              authAction(
                <ExtIcon
                  key={APP_MODULE_BTN_KEY.EDIT}
                  className="edit"
                  onClick={_ => this.edit(record)}
                  type="edit"
                  ignore='true'
                  antd
                />
              )
            }
            <Popconfirm
              key={APP_MODULE_BTN_KEY.DELETE}
              placement="topLeft"
              title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗?删除后无法恢复" })}
              onConfirm={_ => this.del(record)}
            >
              {
                this.renderDelBtn(record)
              }
            </Popconfirm>
          </span>
        )
      },
      {
        title: '实体类全路径',
        dataIndex: 'entityClassName',
        width: 360,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 180,
      },
      {
        title: '表达式',
        dataIndex: 'expressionConfig',
        width: 300,
      },
      {
        title: '配置类型',
        dataIndex: 'configType',
        render: text => {
          switch(text){
            case 'CODE_TYPE': return "一般类型";
            case 'BAR_TYPE': return "条码类型";
            default:return null;
          }
        },
      },
      {
        title: '初始序列',
        dataIndex: 'initialSerial',
      },
      {
        title: '当前序列',
        dataIndex: 'currentSerial',
      },
      {
        title: '生成方式',
        dataIndex: 'genFlag',
        render: text => {
          if (text) {
            return '服务端生成';
          }
          return 'sdk生成';
        },
      },{
        title: '循环策略',
        dataIndex: 'cycleStrategy',
        render: text => {
          switch(text){
            case 'MAX_CYCLE': return "最大值重置";
            case 'MONTH_CYCLE': return "每月重置";
            case 'YEAR_CYCLE': return "每年重置";
            default:return null;
          }
        },
      },
      {
        title: '是否有效',
        dataIndex: 'activated',
        render: text => {
          if (text) {
            return '有效';
          }
          return '无效';
        },
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          {
            authAction(
              <Button
                key={APP_MODULE_BTN_KEY.CREATE}
                type="primary"
                onClick={this.add}
                ignore='true'
              >
                <FormattedMessage id="global.add" defaultMessage="新建" />
              </Button>
            )
          }
          <Button onClick={()=>this.tableRef.remoteDataRrefresh()}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Fragment>
      )
    };
    return {
      columns,
      loading: loading.effects["serialConfig/queryList"],
      remotePaging: true,
      toolBar: toolBarProps,
      searchProperties: [`entityClassName`,`name`],
      store: {
        url: `${SERVER_PATH}/sei-serial/serialNumberConfig/findAll`,
        type: 'POST'
      },
      onTableRef: (ref)=> this.tableRef = ref
    };
  };

  getFormModalProps = () => {
    const { loading, serialConfig, } = this.props;
    const { showModal, rowData } = serialConfig;

    return {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects["serialConfig/save"]
    };
  };

  render() {
    const { serialConfig, } = this.props;
    const { showModal, } = serialConfig;

    return (
      <div className={cls(styles["container-box"])} >
        <ExtTable {...this.getExtableProps()} />
        {
          showModal
            ? <FormModal {...this.getFormModalProps()} />
            : null
        }
      </div>
    );
  }
}

export default SerialConfig;
