import React, { PureComponent } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
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
class ResetModal extends PureComponent {

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

  queryCurrent = () =>{
    const { form, queryCurrent, rowData } = this.props;
    const formData = form.getFieldsValue();
    const params = {};
    Object.assign(params, rowData || {});
    Object.assign(params, formData);
    queryCurrent(params);
  }

  render() {
    const { form, rowData, closeFormModal, saving, showResetModal, current, querying } = this.props;
    const { getFieldDecorator } = form;
    const title = formatMessage({
      id: 'global.edit',
      defaultMessage: '重置当前值',
    })

    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showResetModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.onFormSubmit}
        width={600}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="实体类全路径">
            {getFieldDecorator('className', {
              initialValue: rowData.entityClassName,
              rules: [
                {
                  required: true,
                  message: '实体类全路径不能为空',
                },
              ],
            })(<Input disabled={true} />)}
          </FormItem>
          <FormItem label="隔离码">
            {getFieldDecorator('isolation', {
            })(<Input placeholder='不填写为默认隔离码' />)}
          </FormItem>
          <FormItem label="当前值">
            <InputNumber style={{ width: '100%' }} disabled={true} value={current} />
            <Button onClick={this.queryCurrent} loading={querying}>查询</Button>
          </FormItem>
          <FormItem label="重置值">
            {getFieldDecorator('current', {
              rules: [
                {
                  required: true,
                  message: '初始序列不能为空',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} min={1} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default ResetModal;
