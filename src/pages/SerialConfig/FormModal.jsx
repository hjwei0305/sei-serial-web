import React, { PureComponent } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal } from 'seid'

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

@Form.create()
class FormModal extends PureComponent {

  onFormSubmit = _ => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData
      ? formatMessage({
        id: "global.edit",
        defaultMessage: "编辑"
      })
      : formatMessage({ id: "global.add", defaultMessage: "新建" });
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
          <FormItem label={formatMessage({ id: "global.entityClassName", defaultMessage: "实体类全路径" })}>
            {getFieldDecorator("entityClassName", {
              initialValue: rowData ? rowData.entityClassName : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.entityClassName.required", defaultMessage: "实体类全路径不能为空" })
              }]
            })(<Input disabled={!!rowData} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.isolationCode", defaultMessage: "隔离码" })}>
            {getFieldDecorator("isolationCode", {
              initialValue: rowData ? rowData.isolationCode : "",
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
            {getFieldDecorator("name", {
              initialValue: rowData ? rowData.name : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.expressionConfig", defaultMessage: "表达式" })}>
            {getFieldDecorator("expressionConfig", {
              initialValue: rowData ? rowData.expressionConfig : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.expressionConfig.required", defaultMessage: "表达式不能为空" })
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.initialSerial", defaultMessage: "初始序列" })}>
            {getFieldDecorator("initialSerial", {
              initialValue: rowData ? rowData.initialSerial : 1,
              rules: [{
                required: true,
                message: formatMessage({ id: "global.name.required", defaultMessage: "初始序列不能为空" })
              }]
            })(<InputNumber style={{width:'100%'}}  min={1} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.currentSerial", defaultMessage: "初始序列" })}>
            {getFieldDecorator("currentSerial", {
              initialValue: rowData ? rowData.currentSerial : 1,
              rules: [{
                required: true,
                message: formatMessage({ id: "global.currentSerial.required", defaultMessage: "初始序列不能为空" })
              }]
            })(<InputNumber style={{width:'100%'}} min={1} disabled={!!rowData} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.genFlag", defaultMessage: "生成方式" })}>
            {getFieldDecorator("genFlag", {
              initialValue: rowData ? rowData.genFlag : false,
              rules: [{
                required: true,
                message: formatMessage({ id: "global.genFlag.required", defaultMessage: "初始序列不能为空" })
              }]
            })(<Select>
              <Select.Option value={true}>服务端生成</Select.Option>
              <Select.Option value={false}>sdk生成</Select.Option>
            </Select>)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.cycleStrategy", defaultMessage: "循环策略" })}>
            {getFieldDecorator("cycleStrategy", {
              initialValue: rowData ? rowData.cycleStrategy : "MAX_CYCLE",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.cycleStrategy.required", defaultMessage: "循环策略不能为空" })
              }]
            })(<Select>
              <Select.Option value={"MAX_CYCLE"}>最大值重置</Select.Option>
              <Select.Option value={"MONTH_CYCLE"}>每月重置</Select.Option>
              <Select.Option value={"YEAR_CYCLE"}>每年重置</Select.Option>
            </Select>)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
