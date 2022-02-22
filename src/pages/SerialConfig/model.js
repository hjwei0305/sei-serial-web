/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: Eason
 * @Last Modified time: 2020-08-10 10:51:56
 */
import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { del, getList, save, updateCurrent, queryCurrent } from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'serialConfig',

  state: {
    list: [],
    rowData: null,
    showModal: false,
    showResetModal: false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/serialConfig', location.pathname)) {
          dispatch({
            type: 'queryList',
          });
        }
      });
    },
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const ds = yield call(getList, payload);
      if (ds.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: ds.data.rows,
          },
        });
      } else {
        throw ds;
      }
    },
    *save({ payload }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    *del({ payload }, { call }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    *updateCurrent({ payload }, { call }) {
      const re = yield call(updateCurrent, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '修改成功' }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    *queryCurrent({ payload }, { call, put }) {
      const re = yield call(queryCurrent, payload);
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            current: re.data.currentNumber
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            current: null
          },
        });
        message.error(re.message);
      }

      return re || {};
    },
  },
});
