import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  constructor(props) {
    super(props);

    const { rowData } = this.props;
    const defaultGenFlag = rowData ? rowData.configType === 'BAR_TYPE' : false;
    this.state = {
      defaultGenFlag,
    };
  }

  onFormSubmit = () => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  configTypeChangeHandle = configType => {
    if (configType === 'BAR_TYPE') {
      const { setFieldsValue } = this.props.form;
      setFieldsValue({ genFlag: true });
    }
    this.setState({ defaultGenFlag: configType === 'BAR_TYPE' });
  };

  render() {
    const { defaultGenFlag } = this.state;
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: '编辑',
        })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.onFormSubmit}
        width={600}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="实体类全路径">
            {getFieldDecorator('entityClassName', {
              initialValue: rowData ? rowData.entityClassName : '',
              rules: [
                {
                  required: true,
                  message: '实体类全路径不能为空',
                },
              ],
            })(<Input disabled={!!rowData} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'configType', defaultMessage: '配置类型' })}>
            {getFieldDecorator('configType', {
              initialValue: rowData ? rowData.configType : 'CODE_TYPE',
            })(
              <Select onChange={this.configTypeChangeHandle}>
                <Select.Option value="CODE_TYPE">一般类型</Select.Option>
                <Select.Option value="BAR_TYPE">条码类型</Select.Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: rowData ? rowData.name : '',
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="表达式">
            {getFieldDecorator('expressionConfig', {
              initialValue: rowData ? rowData.expressionConfig : '',
              rules: [
                {
                  required: true,
                  message: '表达式不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="初始序列">
            {getFieldDecorator('initialSerial', {
              initialValue: rowData ? rowData.initialSerial : 1,
              rules: [
                {
                  required: true,
                  message: '初始序列不能为空',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} min={1} />)}
          </FormItem>

          <FormItem label={formatMessage({ id: 'genFlag', defaultMessage: '生成方式' })}>
            {getFieldDecorator('genFlag', {
              initialValue: rowData ? rowData.genFlag : defaultGenFlag,
              rules: [
                {
                  required: true,
                  message: '初始序列不能为空',
                },
              ],
            })(
              <Select>
                <Select.Option value>服务端生成</Select.Option>
                {defaultGenFlag ? null : <Select.Option value={false}>sdk生成</Select.Option>}
              </Select>,
            )}
          </FormItem>
          <FormItem label="循环策略">
            {getFieldDecorator('cycleStrategy', {
              initialValue: rowData ? rowData.cycleStrategy : 'MAX_CYCLE',
              rules: [
                {
                  required: true,
                  message: '循环策略不能为空',
                },
              ],
            })(
              <Select>
                <Select.Option value="MAX_CYCLE">最大值重置</Select.Option>
                <Select.Option value="YEAR_CYCLE">每年重置</Select.Option>
                <Select.Option value="MONTH_CYCLE">每月重置</Select.Option>
                <Select.Option value="DAY_CYCLE">每日重置</Select.Option>
              </Select>,
            )}
          </FormItem>
          {defaultGenFlag ? (
            <FormItem label="返回策略">
              {getFieldDecorator('returnStrategy', {
                initialValue: rowData ? rowData.returnStrategy : 'NEW',
                rules: [
                  {
                    required: true,
                    message: '循环策略不能为空',
                  },
                ],
              })(
                <Select>
                  <Select.Option value="NEW">总是最新</Select.Option>
                  <Select.Option value="REPEAT">同关联ID不变</Select.Option>
                </Select>,
              )}
            </FormItem>
          ) : null}
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
